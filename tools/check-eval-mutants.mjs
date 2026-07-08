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
//   node tools/check-eval-mutants.mjs --bundle okf/<agent>   # sweep a shipped agent
import { runEvalMutants } from "./lib/mutation/harness.mjs";
import { sweepAgentBundle } from "./lib/mutation/sweep-agent.mjs";

const DEFAULT_EVALSET = "tools/lib/mutation/fixtures/benefits.evalset.json";
const DEFAULT_CASSETTE = "tools/lib/live/fixtures/success.ndjson";

function parseArgs(argv) {
  const args = { evalset: DEFAULT_EVALSET, cassette: DEFAULT_CASSETTE, bundle: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--evalset") args.evalset = argv[++i];
    else if (argv[i] === "--cassette") args.cassette = argv[++i];
    else if (argv[i] === "--bundle") args.bundle = argv[++i];
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

export function formatSweepReport(result) {
  const lines = [];
  if (result.ok === false) {
    lines.push(`agent mutation sweep — ${result.agentId}  (${result.bundleDir})`);
    lines.push("");
    lines.push("OKF COMPILE ERRORS — cannot sweep a partial spec:");
    for (const error of result.compileErrors) lines.push(`  • ${error.code || "error"}${error.conceptPath ? ` @ ${error.conceptPath}` : ""}: ${error.message}${error.fix ? ` — fix: ${error.fix}` : ""}`);
    return lines.join("\n");
  }
  const { coverage: cov, totals } = result;
  lines.push(`agent mutation sweep — ${result.agentId}  (${result.bundleDir})`);
  lines.push(`  cases:    ${cov.totalCases} total — ${cov.guardedCases} with a behavioral guard, ${cov.unguardedCases} with none`);
  lines.push(`  guards:   mustCall in ${cov.mustCall}, mustNotCall in ${cov.mustNotCall}, mustCite in ${cov.mustCite} of ${cov.totalCases} cases`);
  lines.push(`  mutants:  ${totals.killed}/${totals.generated} killed, ${totals.survived} survived`);
  if (result.ornamentalCases.length) {
    lines.push("");
    lines.push("ORNAMENTAL CASES (a mutant survived the proof — the guard does not bite):");
    for (const entry of result.ornamentalCases) {
      lines.push(`  • ${entry.caseId}`);
      for (const survivor of entry.survived) lines.push(`      survived: ${survivor.id} (${survivor.guard})`);
    }
  }
  if (cov.mustCite === 0) {
    lines.push("");
    lines.push(`COVERAGE GAP: no case declares a citation guard — an ungrounded answer passes the proof for every case.`);
  }
  lines.push("");
  lines.push(result.ornamental ? "RESULT: ornamental evals found — the proof does not enforce every expectation it declares." : "RESULT: all declared expectations have teeth.");
  return lines.join("\n");
}

const args = parseArgs(process.argv.slice(2));
const result = args.bundle
  ? await sweepAgentBundle(args.bundle)
  : await runEvalMutants({ evalset: args.evalset, cassette: args.cassette });
const render = args.bundle ? formatSweepReport : formatReport;
const failed = result.ornamental || result.ok === false;
const writer = failed ? process.stderr : process.stdout;
writer.write((args.json ? JSON.stringify(result, null, 2) : render(result)) + "\n");
process.exit(failed ? 1 : 0);
