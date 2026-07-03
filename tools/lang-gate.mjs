#!/usr/bin/env node
// lang-gate — mechanical enforcement of the two-register language policy
// (docs/LANGUAGE.md; the prose rule predates this gate in docs/DESIGN.md's
// "Language discipline" section).
//
// The golden register (agent, contract, source system, eval, proof, passport)
// is the only vocabulary allowed to LEAD. Operator-register terms are real and
// documented — planes, daemon, canary, OKF, harness, fleet, pipeline, devex,
// mode — but they must not appear in the zones a stranger reads first:
//
//   1. README.md above the `## Operate` heading
//   2. docs/ Start Here (docs/index.md + docs/start/*.md) and Concepts
//      (docs/concepts/*.md) pages
//   3. the top-level `ge --help` Golden path section
//
// One escape hatch, by design: markdown inside a <details> block is exempt —
// collapsed content IS the progressive disclosure this policy exists to
// create ("Under the hood" maps golden verbs to their operator spellings).
// Everything else in a zone must speak the golden register.
//
//   node tools/lang-gate.mjs           # check, exit 1 on violations
//   node tools/lang-gate.mjs --json    # machine-readable findings
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// The operator register, exactly as docs/LANGUAGE.md tables it (matched as
// whole words, case-insensitive, singular + plural).
export const OPERATOR_TERMS = ["plane", "planes", "daemon", "daemons", "canary", "canaries", "okf", "harness", "harnesses", "fleet", "fleets", "pipeline", "pipelines", "devex", "mode", "modes"];

const TERM_RE = new RegExp(`\\b(${OPERATOR_TERMS.join("|")})\\b`, "gi");

// Strip the content this gate deliberately does not police:
//   - <details>…</details> blocks (the sanctioned under-the-hood escape)
//   - HTML comments (markers, generator pragmas)
//   - URL/path values: markdown link/image targets `](…)` and HTML
//     src/href attribute values — a filename like signature-pipeline.svg is
//     an address, not register; alt text and link TEXT stay policed
// Stripped spans are replaced with equivalent whitespace so line numbers in
// findings stay true.
function stripExemptSpans(text) {
  const preserveLines = (match) => match.replace(/[^\n]/g, " ");
  return text
    .replace(/<details[\s\S]*?<\/details>/gi, preserveLines)
    .replace(/<!--[\s\S]*?-->/g, preserveLines)
    .replace(/\]\([^)\s]+\)/g, (m) => "]" + " ".repeat(m.length - 1))
    .replace(/\b(?:src|href)\s*=\s*"[^"]*"/gi, preserveLines)
    .replace(/\b(?:src|href)\s*=\s*'[^']*'/gi, preserveLines);
}

// Scan one zone's text; returns { line, term, excerpt } findings.
export function scanZoneText(text) {
  const findings = [];
  const lines = stripExemptSpans(text).split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    for (const match of lines[i].matchAll(TERM_RE)) {
      findings.push({ line: i + 1, term: match[1].toLowerCase(), excerpt: lines[i].trim().slice(0, 120) });
    }
  }
  return findings;
}

function readmeZone() {
  const path = join(ROOT, "README.md");
  const text = readFileSync(path, "utf8");
  const operateIdx = text.search(/^## Operate\b/m);
  // No Operate section = no boundary = the whole file is the zone. Strict on
  // purpose: the section is the policy's own artifact.
  return { name: "README.md (above ## Operate)", path: "README.md", text: operateIdx === -1 ? text : text.slice(0, operateIdx) };
}

function docsZones() {
  const zones = [];
  const pages = [join(ROOT, "docs", "index.md")];
  for (const dir of ["start", "concepts"]) {
    const abs = join(ROOT, "docs", dir);
    if (!existsSync(abs)) continue;
    for (const file of readdirSync(abs)) {
      if (file.endsWith(".md")) pages.push(join(abs, file));
    }
  }
  for (const path of pages) {
    if (!existsSync(path)) continue;
    zones.push({ name: path.slice(ROOT.length + 1), path: path.slice(ROOT.length + 1), text: readFileSync(path, "utf8") });
  }
  return zones;
}

async function helpZone() {
  // The rendered Golden path section of `ge --help`, colors stripped — checked
  // from the same renderer the CLI uses, so the gate can't drift from reality.
  const { renderGoldenPathSection } = await import("./ge/help.mjs");
  const { rootCommand } = await import("./ge.mjs");
  return { name: "ge --help (Golden path section)", path: "tools/ge/help.mjs", text: renderGoldenPathSection(rootCommand, { colors: false }) };
}

export async function runLangGate() {
  const zones = [readmeZone(), ...docsZones(), await helpZone()];
  const findings = [];
  for (const zone of zones) {
    for (const finding of scanZoneText(zone.text)) {
      findings.push({ zone: zone.name, path: zone.path, ...finding });
    }
  }
  return { ok: findings.length === 0, zones: zones.length, findings };
}

const __isEntryPoint = (() => {
  try {
    const invoked = process.argv?.[1] ? new URL(`file://${resolve(process.argv[1])}`).href : null;
    return invoked === import.meta.url;
  } catch {
    return false;
  }
})();

if (__isEntryPoint) {
  const result = await runLangGate();
  if (process.argv.includes("--json")) {
    process.stdout.write(JSON.stringify(result, null, 2) + "\n");
  } else if (result.ok) {
    process.stdout.write(`Language gate passed: ${result.zones} golden-register zones clean (no operator-register terms lead).\n`);
  } else {
    process.stderr.write(`Language gate failed: ${result.findings.length} operator-register term(s) in golden-register zones.\n\n`);
    for (const f of result.findings.slice(0, 40)) {
      process.stderr.write(`  ${f.zone}:${f.line}  '${f.term}'  ${f.excerpt}\n`);
    }
    if (result.findings.length > 40) process.stderr.write(`  … ${result.findings.length - 40} more\n`);
    process.stderr.write("\nRephrase in the golden register (see docs/LANGUAGE.md), move the detail under a <details> block, or link the reference/operations page instead.\n");
  }
  process.exit(result.ok ? 0 : 1);
}
