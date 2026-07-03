// tools/ge/bench.mjs — `ge bench`: latency/error budgets as a verdict.
//
//   ge bench --cassette <path>                 deterministic replay (CI-safe)
//   ge bench --yes --sessions 5 --turns 2      small live run (cost-guarded)
//   ge bench --profile .ge/behavioral/bench-profile.json
//   ge bench --export k6 > bench.k6.js
//   ge bench --json
//
// Live runs are explicit: they refuse to start without --yes, and the guard
// rails in .ge.json live.bench are hard caps, not advisories.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog } from "./shared.mjs";
import { runBench, loadBenchProfile } from "../lib/bench/runner.mjs";
import { loadLiveBudgets } from "../lib/bench/budgets.mjs";
import { renderK6Script } from "../lib/bench/k6.mjs";
import { resolveLiveTarget } from "../lib/live/target.mjs";
import { readCassette } from "../lib/live/cassette.mjs";
import { DxError } from "../lib/errors/dx-error.mjs";
import { fmtMs } from "./drive.mjs";

function renderBench(r) {
  out(ui.title("Live Bench", r.profile.id));
  out(ui.kv([
    ["verdict", r.status === "passed" ? pc.green("PASS") : pc.red(r.status.toUpperCase())],
    ["target", pc.dim(r.target.engine)],
    ["source", pc.dim(r.source.replay ? "cassette replay" : "live assist surface")],
    ["load", pc.dim(`${r.counts.sessions} session(s) · ${r.counts.turns} turn(s) · concurrency ${r.profile.concurrency.join(",")}${r.load.stoppedEarly ? " · stopped at deadline" : ""}`)],
  ]));
  out(ui.section("Budgets"));
  const label = {
    ttftMsP95: "time to first text p95",
    fullResponseMsP95: "full response p95",
    interChunkGapMsP99: "inter-chunk stall p99",
    errorRateMax: "error rate",
    responderUnknownRateMax: "responder unknown rate",
    responderMismatchRateMax: "responder mismatch rate",
  };
  for (const verdict of r.budgetVerdicts) {
    const isMs = verdict.budget.includes("Ms");
    const observed = verdict.observed === null ? "—" : isMs ? fmtMs(verdict.observed) : String(verdict.observed);
    const limit = isMs ? fmtMs(verdict.limit) : String(verdict.limit);
    out(`  ${ui.glyph(verdict.ok ? "passed" : "failed")} ${(label[verdict.budget] || verdict.budget).padEnd(24)} ${observed.padStart(8)}  ${pc.dim(`budget ${verdict.budget.endsWith("Max") ? "≤ " : ""}${limit}`)}`);
  }
  out(ui.section("Latency"));
  const row = (name, p) => out(`  ${name.padEnd(18)} p50 ${fmtMs(p.p50).padStart(7)}   p95 ${fmtMs(p.p95).padStart(7)}   p99 ${fmtMs(p.p99).padStart(7)}  ${pc.dim(`n=${p.count}`)}`);
  row("first text", r.percentiles.ttftMs);
  row("full response", r.percentiles.fullResponseMs);
  row("inter-chunk gap", r.percentiles.interChunkGapMs);
  if (r.errors.total) {
    out(ui.section("Errors"));
    out(`  ${r.errors.total}/${r.counts.turns} turn(s) failed (${(r.errors.rate * 100).toFixed(1)}%)  ${pc.dim(Object.entries(r.errors.byCode).map(([code, count]) => `${code}×${count}`).join(" · "))}`);
  }
  out(ui.kv([["artifact", pc.dim(r.artifacts.benchResult)]]));
  out(ui.next(r.status === "passed" ? "ge prove --live" : "ge drive", r.status === "passed" ? "behavioral verification on the same surface" : "reproduce the slow/failing conversation interactively"));
}

function parseConcurrency(raw) {
  if (!raw) return [1];
  const levels = String(raw).split(",").map((part) => Number(part.trim())).filter((level) => Number.isFinite(level) && level > 0);
  if (!levels.length) {
    throw new DxError(`invalid --concurrency: ${raw}`, {
      where: "--concurrency",
      why: "expected a number or comma-separated sweep like 1,2,4",
      fix: "ge bench --concurrency 1,2,4",
    });
  }
  return levels;
}

export const bench = defineCommand({
  meta: { name: "bench", description: "Load the live assist surface within hard cost guards and verdict the latency/error budgets (ttft, full response, stalls, errors, responder identity)" },
  args: {
    ...common,
    sessions: { type: "string", description: "Number of independent conversations (default 5; hard-capped by live.bench guards)" },
    turns: { type: "string", description: "Turns per conversation (default 2)" },
    concurrency: { type: "string", description: "Concurrency sweep, e.g. 1,2,4 (default 1)" },
    cassette: { type: "string", description: "Replay a recorded cassette — deterministic timings, zero cloud (the CI path)" },
    profile: { type: "string", description: "Bench profile JSON (e.g. .ge/behavioral/bench-profile.json from ge evals compile)" },
    targetAgent: { type: "string", description: "Expected responding agent id — responder rates then count against budgets" },
    strictResponder: { type: "boolean", description: "Treat unverifiable responder identity as failure" },
    export: { type: "string", description: "Export a load script instead of running: k6" },
    yes: { type: "boolean", description: "Confirm a LIVE bench run (real traffic, real cost) — refused without it" },
    geApp: { type: "string", description: "Gemini Enterprise engine (full resource name or bare id; default from .ge.json geAppId)" },
  },
  run: guarded(async ({ args }) => {
    const cfg = cfgFrom(args);
    const profile = args.profile ? loadBenchProfile(args.profile) : null;
    const sessions = Number(args.sessions || profile?.sessions || 5);
    const turnsPerSession = Number(args.turns || profile?.turnsPerSession || 2);
    const concurrency = args.concurrency ? parseConcurrency(args.concurrency) : (profile?.concurrency || [1]);

    if (args.export) {
      if (args.export !== "k6") {
        throw new DxError(`unknown export format: ${args.export}`, {
          where: "--export",
          why: "k6 is the only supported load-script export",
          fix: "ge bench --export k6",
        });
      }
      const target = args.cassette ? { url: `https://<endpoint>/v1/${readCassette(args.cassette).meta.target?.engine || "<engine>"}/assistants/default_assistant:streamAssist` } : resolveLiveTarget(cfg);
      out(renderK6Script({ target, sessions, turnsPerSession, turnTexts: profile?.turns || ["Summarize what you can help with in one sentence."], budgets: loadLiveBudgets() }));
      return;
    }

    if (!args.cassette && !args.yes) {
      throw new DxError("a live bench sends real traffic at a paid surface — confirm with --yes", {
        where: "ge bench",
        why: "live load runs are explicit and cost-guarded by design; replays never need confirmation",
        fix: "ge bench --cassette <recording>   (or: ge bench --yes --sessions 5 --turns 2)",
      });
    }

    const result = await runBench(cfg, {
      cassette: args.cassette,
      profile,
      sessions,
      turnsPerSession,
      concurrency,
      targetAgent: args.targetAgent,
      strictResponder: args.strictResponder,
      log: elog,
    });
    emit(args, result, renderBench);
    if (result.status !== "passed") process.exitCode = 1;
  }),
});
