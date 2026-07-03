#!/usr/bin/env bun
// TTFP — time to first proof. The DX scoreboard.
//
// Runs the documented fresh-environment golden path up to the first proof
// attempt, and reports two numbers per path:
//   wall-clock   — measured, this machine, this run (setup excluded: it is
//                  identical for both paths, so it cancels out of the diff)
//   decisions    — commands the operator must type + required flags/values +
//                  interactive choices along the way (counted from the path
//                  definition, not the run)
//
//   bun tools/bench-ttfp.mjs                 # run the current (golden) path
//   bun tools/bench-ttfp.mjs --path legacy   # run the pre-verb operator path
//   bun tools/bench-ttfp.mjs --json          # machine-readable result
//
// Honesty rule: if the proof blocks (e.g. no uv/gcloud on this machine), the
// benchmark reports `blockedAt` rather than pretending a proof happened —
// the wall-clock then measures time-to-first-verdict, which is still the
// number a stranger experiences.
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// Each step: what the operator types, and how many decisions it costs them.
// A "decision" = a thing the operator had to know or choose that the tool did
// not choose for them: picking the command itself counts 1; every required
// flag/value counts 1; every interactive prompt counts 1. Optional flags with
// working defaults count 0 — defaults making flags unnecessary is the point.
const PATHS = {
  golden: {
    label: "golden path (ge prove)",
    steps: [
      { run: ["tools/ge.mjs"], describe: "ge", decisions: 0, note: "orientation: board says the next command — reading it is free" },
      { run: ["tools/ge.mjs", "prove", "--json"], describe: "ge prove", decisions: 1, note: "one verb; dispatch (fresh smoke vs workspace build) is automatic" },
    ],
  },
  legacy: {
    label: "operator path (ge devex smoke)",
    steps: [
      { run: ["tools/ge.mjs"], describe: "ge", decisions: 0, note: "orientation: board names devex smoke on first run" },
      { run: ["tools/ge.mjs", "devex", "smoke", "--json"], describe: "ge devex smoke", decisions: 2, note: "noun+verb pair: know the devex group, then pick smoke over check" },
    ],
  },
};

function runStep(step) {
  const startedAt = Date.now();
  const res = spawnSync("bun", step.run, { cwd: REPO_ROOT, encoding: "utf8", timeout: 30 * 60 * 1000 });
  const elapsedMs = Date.now() - startedAt;
  let blockedAt = null;
  let ok = res.status === 0;
  try {
    const parsed = JSON.parse(res.stdout);
    if (parsed && parsed.ok === false) { ok = false; blockedAt = parsed.stage || parsed.blocker || "unknown"; }
  } catch { /* human output (bare `ge`) — exit code is the verdict */ }
  return { describe: step.describe, decisions: step.decisions, note: step.note, elapsedMs, ok, blockedAt };
}

const argv = process.argv.slice(2);
const json = argv.includes("--json");
const pathArg = argv.includes("--path") ? argv[argv.indexOf("--path") + 1] : "golden";
const path = PATHS[pathArg];
if (!path) {
  process.stderr.write(`unknown --path '${pathArg}' (know: ${Object.keys(PATHS).join(", ")})\n`);
  process.exit(2);
}

const steps = path.steps.map(runStep);
const totalMs = steps.reduce((sum, s) => sum + s.elapsedMs, 0);
const decisions = steps.reduce((sum, s) => sum + s.decisions, 0);
const blocked = steps.find((s) => s.blockedAt);
const result = {
  kind: "ge.bench.ttfp",
  path: pathArg,
  label: path.label,
  totalMs,
  totalMinutes: Math.round((totalMs / 60000) * 100) / 100,
  decisions,
  proved: steps.every((s) => s.ok),
  blockedAt: blocked?.blockedAt || null,
  steps,
};

if (json) {
  process.stdout.write(JSON.stringify(result, null, 2) + "\n");
} else {
  process.stdout.write(`\nTTFP — ${path.label}\n`);
  for (const s of steps) {
    process.stdout.write(`  $ ${s.describe.padEnd(20)} ${(s.elapsedMs / 1000).toFixed(1)}s  decisions=${s.decisions}${s.blockedAt ? `  BLOCKED at ${s.blockedAt}` : s.ok ? "" : "  FAILED"}\n`);
  }
  process.stdout.write(`\n  wall-clock ${result.totalMinutes} min   decisions ${decisions}   ${result.proved ? "proof reached" : `first verdict: blocked at ${result.blockedAt || "failure"}`}\n`);
}
process.exitCode = 0; // the benchmark itself succeeded; the numbers are the payload
