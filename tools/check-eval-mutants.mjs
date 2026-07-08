#!/usr/bin/env node
// Eval mutation testing — proves the live proof's expectations have teeth.
//
// Derives one behavioral mutant per declared expectation in an evalset,
// applies it to a matched green cassette, and re-runs the REAL live proof
// offline. Every declared guard must KILL its mutant; a survivor is an
// ornamental eval (the proof declares an expectation it does not enforce).
// Untested guards (expectations the evalset never declares) are reported as
// coverage gaps — warnings, not failures.
//
// Exits non-zero iff a declared guard is ornamental. Defaults to the
// checked-in benefits fixture pair, which is fully guarded (a self-test that
// the harness and the proof machinery agree).
//
//   node tools/check-eval-mutants.mjs
//   node tools/check-eval-mutants.mjs --evalset <path> --cassette <path>
import { runEvalMutants } from "./lib/mutation/harness.mjs";

const DEFAULT_EVALSET = "tools/lib/mutation/fixtures/benefits.evalset.json";
const DEFAULT_CASSETTE = "tools/lib/live/fixtures/success.ndjson";

function parseArgs(argv) {
  const args = { evalset: DEFAULT_EVALSET, cassette: DEFAULT_CASSETTE, json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--evalset") args.evalset = argv[++i];
    else if (argv[i] === "--cassette") args.cassette = argv[++i];
    else if (argv[i] === "--json") args.json = true;
  }
  return args;
}

export function formatReport(result) {
  const lines = [];
  const { score } = result;
  lines.push(`eval mutation report — ${result.subject.evalset}`);
  lines.push(`  cassette: ${result.subject.cassette}`);
  lines.push(`  baseline: ${result.baseline.passed ? "green" : "NOT GREEN"}`);
  lines.push(`  mutants:  ${score.killed}/${score.generated} killed, ${score.survived} survived`);
  lines.push("");
  for (const mutant of result.mutants) {
    const tag = mutant.killed ? (mutant.killedByIntendedGuard ? "KILLED" : "KILLED (wrong guard)") : "SURVIVED";
    const caught = mutant.caughtBy.length ? ` → ${mutant.caughtBy.join(", ")}` : "";
    lines.push(`  [${tag}] ${mutant.id}  (guard: ${mutant.guard})${caught}`);
  }
  if (result.survived.length) {
    lines.push("");
    lines.push("ORNAMENTAL EVALS (declared but unenforced — a misbehaving agent passes the proof):");
    for (const mutant of result.survived) lines.push(`  • ${mutant.id} — the ${mutant.guard} guard did not fire`);
  }
  if (result.misattributed.length) {
    lines.push("");
    lines.push("MIS-ATTRIBUTED KILLS (mutant died, but not by its intended guard — that guard is still unproven):");
    for (const mutant of result.misattributed) lines.push(`  • ${mutant.id} — intended ${mutant.metric}, caught by ${mutant.caughtBy.join(", ") || "none"}`);
  }
  if (result.gaps.length) {
    lines.push("");
    lines.push("COVERAGE GAPS (no guard declared — the violation is invisible to the proof):");
    for (const gap of result.gaps) lines.push(`  • ${gap.guard}/${gap.metric}: ${gap.note}`);
  }
  lines.push("");
  lines.push(result.ornamental ? "RESULT: ornamental evals found — the proof does not enforce every expectation it declares." : "RESULT: all declared expectations have teeth.");
  return lines.join("\n");
}

const args = parseArgs(process.argv.slice(2));
const result = await runEvalMutants({ evalset: args.evalset, cassette: args.cassette });
const writer = result.ornamental ? process.stderr : process.stdout;
writer.write((args.json ? JSON.stringify(result, null, 2) : formatReport(result)) + "\n");
process.exit(result.ornamental ? 1 : 0);
