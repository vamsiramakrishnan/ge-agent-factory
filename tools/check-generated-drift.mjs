#!/usr/bin/env node
// check-generated-drift — prove that tracked generated files are byte-stable.
//
// Several `*.generated.*` files are committed to git but written by generator
// scripts. If a generator is nondeterministic (wall-clock timestamps, unstable
// key order, Map/Set iteration leaks), ordinary test/catalog runs rewrite the
// tracked bytes and every concurrent worktree pays for it (taste-campaign
// 08-next-horizon §A1: six sessions had to `git checkout --` the agent-spec
// registry). This checker regenerates each declared file to a TEMP path (via
// the generator's output-override env var, so the tracked file is never
// touched) and byte-compares against the tracked copy. Any drift means the
// generator is nondeterministic or the tracked file is stale — both are
// failures.
//
// Adding a future generated file = adding one row to GENERATED_FILES below:
//   { id, trackedFile, command: [argv...], outEnv, regenerate }
// where the generator writes to $<outEnv> when set, and `regenerate` is the
// human command that refreshes the tracked copy after a legitimate change.
//
//   node tools/check-generated-drift.mjs   # exit 1 on drift (part of source:hygiene)
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");

export const GENERATED_FILES = [
  {
    id: "agent-spec-registry",
    // Regenerated from the OKF corpus (okf/ is the primary catalog source);
    // sync-use-cases-from-slides.mjs remains the byte-identical legacy path.
    trackedFile: "apps/factory/src/agent-spec-registry.generated.json",
    command: ["node", "apps/factory/scripts/sync-use-cases-from-okf.mjs"],
    outEnv: "GE_AGENT_SPEC_REGISTRY_OUT",
    regenerate: "bun run catalog",
  },
];

// Locate the first line where two buffers' UTF-8 decodings diverge, for a
// human-sized excerpt (the tracked files can be hundreds of KB — never dump
// a full diff).
function firstDifferingLine(actualText, expectedText) {
  const actualLines = actualText.split("\n");
  const expectedLines = expectedText.split("\n");
  const max = Math.max(actualLines.length, expectedLines.length);
  for (let i = 0; i < max; i += 1) {
    if (actualLines[i] !== expectedLines[i]) {
      const clip = (line) => (line === undefined ? "<missing>" : line.length > 200 ? `${line.slice(0, 200)}…` : line);
      return { line: i + 1, tracked: clip(actualLines[i]), regenerated: clip(expectedLines[i]) };
    }
  }
  return null;
}

// Regenerate every declared file to a temp path and byte-compare against the
// tracked copy. Returns { ok, findings } — rendering happens at the CLI
// boundary below (house rule: return/throw, don't print/exit).
export function checkGeneratedDrift(rows = GENERATED_FILES, { root = ROOT } = {}) {
  const findings = [];
  for (const row of rows) {
    const tmp = mkdtempSync(join(tmpdir(), `check-generated-drift-${row.id}-`));
    try {
      const outPath = join(tmp, "regenerated");
      const [cmd, ...args] = row.command;
      const run = spawnSync(cmd, args, {
        cwd: root,
        env: { ...process.env, [row.outEnv]: outPath },
        encoding: "utf8",
        timeout: 120_000,
      });
      if (run.status !== 0) {
        findings.push({
          id: row.id,
          file: row.trackedFile,
          regenerate: row.regenerate,
          generatorFailed: true,
          detail: (run.stderr || run.stdout || String(run.error?.message || "")).trim().slice(0, 1000),
        });
        continue;
      }
      let regenerated;
      try {
        regenerated = readFileSync(outPath);
      } catch {
        findings.push({
          id: row.id,
          file: row.trackedFile,
          regenerate: row.regenerate,
          generatorFailed: true,
          detail: `generator exited 0 but wrote nothing to $${row.outEnv}`,
        });
        continue;
      }
      let tracked;
      try {
        tracked = readFileSync(resolve(root, row.trackedFile));
      } catch {
        findings.push({ id: row.id, file: row.trackedFile, regenerate: row.regenerate, missing: true });
        continue;
      }
      if (!tracked.equals(regenerated)) {
        findings.push({
          id: row.id,
          file: row.trackedFile,
          regenerate: row.regenerate,
          drift: firstDifferingLine(tracked.toString("utf8"), regenerated.toString("utf8")),
          trackedBytes: tracked.length,
          regeneratedBytes: regenerated.length,
        });
      }
    } finally {
      rmSync(tmp, { recursive: true, force: true });
    }
  }
  return { ok: findings.length === 0, findings, checked: rows.length };
}

export function formatDriftReport(result) {
  if (result.ok) {
    const n = result.checked;
    return `Generated-file drift check passed: ${n} tracked generated file${n === 1 ? "" : "s"} byte-match regeneration.`;
  }
  const lines = ["Generated-file drift check FAILED:"];
  for (const f of result.findings) {
    lines.push("");
    if (f.generatorFailed) {
      lines.push(`${f.file}: generator failed (${f.id}).`);
      if (f.detail) lines.push(`  ${f.detail.split("\n").join("\n  ")}`);
      continue;
    }
    if (f.missing) {
      lines.push(`${f.file} is missing — regenerate it with: ${f.regenerate}`);
      continue;
    }
    lines.push(
      `${f.file}: tracked bytes differ from a fresh regeneration ` +
        `(${f.trackedBytes} vs ${f.regeneratedBytes} bytes).`,
    );
    if (f.drift) {
      lines.push(`  first difference at line ${f.drift.line}:`);
      lines.push(`  -tracked:     ${f.drift.tracked}`);
      lines.push(`  +regenerated: ${f.drift.regenerated}`);
    }
    lines.push(
      "  Either the generator became nondeterministic (fix the generator — regeneration",
      "  over unchanged inputs must be a byte no-op) or the tracked file is stale after a",
      `  legitimate input change (refresh it with: ${f.regenerate} and commit the result).`,
    );
  }
  return lines.join("\n");
}

// Run only when this file is the process entry point (house pattern) —
// importing it must stay side-effect-free.
const __isEntryPoint = (() => {
  try {
    const invoked = process.argv?.[1] ? new URL(`file://${resolve(process.argv[1])}`).href : null;
    return invoked === import.meta.url;
  } catch {
    return false;
  }
})();

if (__isEntryPoint) {
  try {
    const result = checkGeneratedDrift();
    const writer = result.ok ? process.stdout : process.stderr;
    writer.write(formatDriftReport(result) + "\n");
    process.exit(result.ok ? 0 : 1);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}
