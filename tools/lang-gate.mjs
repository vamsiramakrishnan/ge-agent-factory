#!/usr/bin/env node
// lang-gate — mechanical enforcement of the two-register language policy
// (docs/LANGUAGE.md; the prose rule predates this gate in docs/DESIGN.md's
// "Language discipline" section).
//
// The golden register (agent, contract, source system, eval, proof, passport,
// OKF — the spec format itself is part of the product's front-door story)
// is the only vocabulary allowed to LEAD. Operator-register terms are real and
// documented — planes, daemon, canary, harness, fleet, pipeline, devex,
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
// It also enforces the copy standards (docs/LANGUAGE.md "Copy standards"):
// a banned-phrase list (insider slang, defensive asides, adjective-only
// claims) checked across every reader-facing page — README, SETUP,
// CONTRIBUTING, and docs/ minus the internal working directories.
//
//   node tools/lang-gate.mjs           # check, exit 1 on violations
//   node tools/lang-gate.mjs --json    # machine-readable findings
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// The operator register, exactly as docs/LANGUAGE.md tables it (matched as
// whole words, case-insensitive, singular + plural).
export const OPERATOR_TERMS = ["plane", "planes", "daemon", "daemons", "canary", "canaries", "harness", "harnesses", "fleet", "fleets", "pipeline", "pipelines", "devex", "mode", "modes"];

const TERM_RE = new RegExp(`\\b(${OPERATOR_TERMS.join("|")})\\b`, "gi");

// Copy standards (docs/LANGUAGE.md "Copy standards"): phrases with no
// legitimate documentation use — insider slang, defensive asides, and
// adjective-only performance claims. Checked in every reader-facing page,
// not just the golden zones. Extend this list when a new tic slips through
// review.
export const BANNED_PHRASES = [
  "vibes",
  "in anger",
  "pretense",
  "no pretending",
  "handwavy",
  "hand-wavy",
  "deliberately boring",
  "blazingly",
  "dead simple",
  "super easy",
  "silver bullet",
  "secret sauce",
];

const PHRASE_RE = new RegExp(`\\b(${BANNED_PHRASES.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`, "gi");

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
      // "Failure mode" is ordinary engineering English, not the factory's
      // local-vs-remote execution-mode jargon this policy is meant to keep
      // out of front-door copy.
      if (/^modes?$/i.test(match[1]) && /\bfailure\s+$/i.test(lines[i].slice(0, match.index))) continue;
      findings.push({ line: i + 1, term: match[1].toLowerCase(), excerpt: lines[i].trim().slice(0, 120) });
    }
  }
  return findings;
}

// Scan one page for banned copy phrases; same finding shape, kind "copy".
// Code blocks are exempt (a phrase inside a fenced block is quoted output,
// not the docs' own voice), alongside the shared exemptions.
export function scanCopyText(text) {
  const findings = [];
  const stripped = stripExemptSpans(text).replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, " "));
  const lines = stripped.split("\n");
  for (let i = 0; i < lines.length; i += 1) {
    for (const match of lines[i].matchAll(PHRASE_RE)) {
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

// Curated Starlight pages are authored outside docs/, so they do not pass
// through the canonical Start Here scan above. The landing page and tutorial
// are front-door copy and follow the same golden-register policy.
const CURATED_SITE_PAGES = [
  "apps/docs/src/content/docs/index.mdx",
  "apps/docs/src/content/docs/start/quickstart.mdx",
  "apps/docs/src/content/docs/catalog.mdx",
  "apps/docs/src/content/docs/catalog-verticals.mdx",
];

function curatedGoldenZones() {
  return CURATED_SITE_PAGES.slice(0, 2)
    .map((relPath) => join(ROOT, relPath))
    .filter(existsSync)
    .map((path) => ({
      name: path.slice(ROOT.length + 1),
      path: path.slice(ROOT.length + 1),
      text: readFileSync(path, "utf8"),
    }));
}

async function helpZone() {
  // The rendered Golden path section of `ge --help`, colors stripped — checked
  // from the same renderer the CLI uses, so the gate can't drift from reality.
  const { renderGoldenPathSection } = await import("./ge/help.mjs");
  const { rootCommand } = await import("./ge.mjs");
  return { name: "ge --help (Golden path section)", path: "tools/ge/help.mjs", text: renderGoldenPathSection(rootCommand, { colors: false }) };
}

// Every reader-facing page, for the copy-standards phrase check. Internal
// working documents (plans, design-specs, ADRs) keep their working voice.
function copyZones() {
  const EXCLUDED_DOC_DIRS = new Set(["plans", "design-specs", "adr", "tapes", "collateral", "assets", "diagrams-src", "_includes", "_sass"]);
  const pages = ["README.md", "AGENTS.md", "SETUP.md", "CONTRIBUTING.md", ...CURATED_SITE_PAGES]
    .map((p) => join(ROOT, p))
    .filter(existsSync);
  const docsDir = join(ROOT, "docs");
  for (const rel of readdirSync(docsDir, { recursive: true })) {
    const relPath = String(rel);
    if (!relPath.endsWith(".md")) continue;
    if (EXCLUDED_DOC_DIRS.has(relPath.split(/[\\/]/, 1)[0])) continue;
    // The policy page quotes the phrases it bans; it can't police itself.
    if (relPath === "LANGUAGE.md") continue;
    pages.push(join(docsDir, relPath));
  }
  return pages.map((path) => ({ name: path.slice(ROOT.length + 1), path: path.slice(ROOT.length + 1), text: readFileSync(path, "utf8") }));
}

export async function runLangGate() {
  const zones = [readmeZone(), ...docsZones(), ...curatedGoldenZones(), await helpZone()];
  const findings = [];
  for (const zone of zones) {
    for (const finding of scanZoneText(zone.text)) {
      findings.push({ zone: zone.name, path: zone.path, kind: "register", ...finding });
    }
  }
  const pages = copyZones();
  for (const page of pages) {
    for (const finding of scanCopyText(page.text)) {
      findings.push({ zone: page.name, path: page.path, kind: "copy", ...finding });
    }
  }
  return { ok: findings.length === 0, zones: zones.length, copyPages: pages.length, findings };
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
    process.stdout.write(`Language gate passed: ${result.zones} golden-register zones clean, ${result.copyPages} reader-facing pages free of banned copy phrases.\n`);
  } else {
    const registerCount = result.findings.filter((f) => f.kind === "register").length;
    const copyCount = result.findings.length - registerCount;
    process.stderr.write(`Language gate failed: ${registerCount} operator-register term(s) in golden-register zones, ${copyCount} banned copy phrase(s) in reader-facing pages.\n\n`);
    for (const f of result.findings.slice(0, 40)) {
      process.stderr.write(`  ${f.zone}:${f.line}  [${f.kind}] '${f.term}'  ${f.excerpt}\n`);
    }
    if (result.findings.length > 40) process.stderr.write(`  … ${result.findings.length - 40} more\n`);
    process.stderr.write("\n[register] Rephrase in the golden register (see docs/LANGUAGE.md), move the detail under a <details> block, or link the reference/operations page instead.\n[copy] Rewrite in plain professional prose (docs/LANGUAGE.md 'Copy standards').\n");
  }
  process.exit(result.ok ? 0 : 1);
}
