// The live bench runner — N sessions × M turns at swept concurrency levels,
// through the same conversation driver every other live surface uses, folded
// into a LiveBenchResult verdict against budgets.
//
// Execution targets mirror drive/prove: a cassette (deterministic — recorded
// timing offsets become the samples; the default for CI) or the live assist
// surface (explicit, cost-guarded).
import { readJson, writeJson } from "@ge/std/json-io";
import { statePath, relativeToRepo } from "../state-paths.mjs";
import { readCassette, createCassetteRunner } from "../live/cassette.mjs";
import { createLiveRunner } from "../live/streamassist-client.mjs";
import { resolveLiveTarget } from "../live/target.mjs";
import { runConversation } from "../live/conversation.mjs";
import { liveError } from "../live/errors.mjs";
import { percentiles, histogram } from "./histogram.mjs";
import { evaluateBudgets, loadLiveBudgets, loadBenchGuards } from "./budgets.mjs";

export const LIVE_BENCH_API_VERSION = "ge.dev/v1";
export const LIVE_BENCH_KIND = "LiveBenchResult";

// Enforce the hard caps BEFORE anything runs. Guards are never advisory.
export function applyBenchGuards({ sessions, turnsPerSession, concurrency, guards }) {
  const failures = [];
  if (sessions > guards.maxSessions) failures.push(`sessions ${sessions} > max ${guards.maxSessions}`);
  if (turnsPerSession > guards.maxTurnsPerSession) failures.push(`turns ${turnsPerSession} > max ${guards.maxTurnsPerSession}`);
  const maxLevel = Math.max(...(Array.isArray(concurrency) ? concurrency : [concurrency]));
  if (maxLevel > guards.maxConcurrency) failures.push(`concurrency ${maxLevel} > max ${guards.maxConcurrency}`);
  if (failures.length) {
    throw liveError("GELIVE008", `bench plan exceeds the configured guard rails: ${failures.join("; ")}`, {
      where: ".ge.json live.bench (guards) / bench flags",
      why: "cost guards are hard caps so a typo cannot buy an accidental load test",
      fix: "lower --sessions/--turns/--concurrency, or raise live.bench limits in .ge.json deliberately",
    });
  }
}

async function runSession({ makeRunner, turnTexts, target, strictResponder, sessionIndex, concurrencyLevel }) {
  const runner = await makeRunner();
  try {
    const { transcript } = await runConversation(runner, turnTexts.map((text) => ({ text })), {
      target,
      id: `bench-s${sessionIndex}-c${concurrencyLevel}`,
      strictResponder,
    });
    return { transcript };
  } catch (error) {
    return { error };
  } finally {
    await runner.close?.();
  }
}

async function pool(count, limit, worker) {
  const results = new Array(count);
  let next = 0;
  const lanes = Array.from({ length: Math.min(limit, count) }, async () => {
    for (;;) {
      const index = next++;
      if (index >= count) return;
      results[index] = await worker(index);
    }
  });
  await Promise.all(lanes);
  return results;
}

export async function runBench(cfg, {
  cassette,
  profile = null,
  sessions = 5,
  turnsPerSession = 2,
  concurrency = [1],
  targetAgent,
  strictResponder = false,
  budgets: budgetOverrides = {},
  guards: guardOverrides = {},
  deadlineMs,
  outRoot,
  now = () => Date.now(),
  log = () => {},
} = {}) {
  const levels = Array.isArray(concurrency) ? concurrency : [concurrency];
  const guards = loadBenchGuards({ overrides: guardOverrides });
  applyBenchGuards({ sessions, turnsPerSession, concurrency: levels, guards });
  const budgets = loadLiveBudgets({ overrides: budgetOverrides });
  const deadline = now() + (deadlineMs ?? guards.maxDurationSeconds * 1000);

  // Execution target + the turn script (profile mix > cassette recording).
  let target;
  let makeRunner;
  let turnTexts;
  if (cassette) {
    const parsed = readCassette(cassette);
    const metaTarget = parsed.meta.target || {};
    target = {
      project: metaTarget.project || cfg?.project,
      location: metaTarget.location || cfg?.geLocation || "global",
      engine: metaTarget.engine || cfg?.geAppId || "<recorded>",
      assistant: metaTarget.assistant || "default_assistant",
      expectedAgentId: targetAgent ?? null,
    };
    makeRunner = async () => createCassetteRunner(parsed, { loop: true });
    turnTexts = parsed.turns.map((turn) => turn.request?.body?.query?.text || "…");
  } else {
    target = resolveLiveTarget(cfg, { expectedAgentId: targetAgent ?? null });
    makeRunner = async () => createLiveRunner(target);
    turnTexts = profile?.turns || ["Summarize what you can help with in one sentence."];
  }
  const script = Array.from({ length: turnsPerSession }, (_, index) => turnTexts[index % turnTexts.length]);

  const samples = { ttftMs: [], fullResponseMs: [], interChunkGapMs: [] };
  const counts = { sessions: 0, turns: 0, errors: 0, responderUnknown: 0, responderMismatch: 0 };
  const errorsByCode = {};
  const perLevel = [];
  let stoppedEarly = false;

  for (const level of levels) {
    if (now() > deadline) {
      stoppedEarly = true;
      log(`deadline reached before concurrency ${level} — skipping remaining levels`);
      break;
    }
    log(`concurrency ${level}: ${sessions} session(s) × ${script.length} turn(s)`);
    const levelStart = now();
    const results = await pool(sessions, level, (sessionIndex) => {
      if (now() > deadline) return { skipped: true };
      return runSession({ makeRunner, turnTexts: script, target, strictResponder, sessionIndex, concurrencyLevel: level });
    });
    let levelSessions = 0;
    for (const result of results) {
      if (!result || result.skipped) {
        stoppedEarly = true;
        continue;
      }
      levelSessions += 1;
      counts.sessions += 1;
      if (result.error) {
        counts.errors += script.length; // the whole session's turns failed to complete
        counts.turns += script.length;
        const code = result.error.code || "unknown";
        errorsByCode[code] = (errorsByCode[code] || 0) + 1;
        continue;
      }
      const transcript = result.transcript;
      for (const turn of transcript.turns) {
        counts.turns += 1;
        if (turn.stream.ttftMs !== null) samples.ttftMs.push(turn.stream.ttftMs);
        if (turn.stream.fullResponseMs !== null) samples.fullResponseMs.push(turn.stream.fullResponseMs);
        if (turn.stream.maxInterChunkGapMs !== null) samples.interChunkGapMs.push(turn.stream.maxInterChunkGapMs);
        if (turn.assistant.state === "FAILED") {
          counts.errors += 1;
          errorsByCode.GELIVE004 = (errorsByCode.GELIVE004 || 0) + 1;
        }
      }
      if (transcript.responder.assertion === "unknown") counts.responderUnknown += 1;
      if (transcript.responder.assertion === "mismatched") counts.responderMismatch += 1;
    }
    perLevel.push({ concurrency: level, sessions: levelSessions, wallMs: now() - levelStart });
  }

  const budgetResult = evaluateBudgets({ samples, counts, budgets, responderAsserted: !!targetAgent });
  const status = counts.sessions === 0 ? "blocked" : budgetResult.passed ? "passed" : "failed";
  const result = {
    apiVersion: LIVE_BENCH_API_VERSION,
    kind: LIVE_BENCH_KIND,
    status,
    target: { project: target.project, location: target.location, engine: target.engine, assistant: target.assistant, expectedAgentId: target.expectedAgentId ?? null },
    source: { runner: cassette ? "cassette" : "streamassist", replay: !!cassette },
    profile: { id: profile?.id || (cassette ? "cassette-replay" : "default"), sessions, turnsPerSession, concurrency: levels },
    load: { perLevel, stoppedEarly },
    counts,
    percentiles: {
      ttftMs: percentiles(samples.ttftMs),
      fullResponseMs: percentiles(samples.fullResponseMs),
      interChunkGapMs: percentiles(samples.interChunkGapMs),
    },
    distributions: { ttftMs: histogram(samples.ttftMs) },
    errors: {
      total: counts.errors,
      rate: counts.turns ? Number((counts.errors / counts.turns).toFixed(4)) : 0,
      byCode: errorsByCode,
    },
    budgets,
    budgetVerdicts: budgetResult.verdicts,
    verdict: {
      gate: "live-bench",
      passed: status === "passed",
      blockers: budgetResult.verdicts.filter((verdict) => !verdict.ok).map((verdict) => ({
        code: "GELIVE008",
        what: `budget ${verdict.budget}: observed ${verdict.observed} vs limit ${verdict.limit}`,
        retryable: false,
        fix: "ge bench --cassette <recording> to reproduce locally, or raise the budget in .ge.json live.budgets deliberately",
      })),
    },
  };

  const proofDir = outRoot ? `${outRoot}/proof` : statePath("proof");
  const resultPath = `${proofDir}/bench-result.json`;
  writeJson(resultPath, result);
  result.artifacts = { benchResult: relativeToRepo(resultPath) };
  return result;
}

// Load a bench profile emitted by the behavioral compiler
// (.ge/behavioral/bench-profile.json) or hand-written.
export function loadBenchProfile(path) {
  const profile = readJson(path, null);
  if (!profile) {
    throw liveError("GELIVE008", `bench profile not found: ${path}`, {
      where: path,
      why: "the profile file does not exist or is not JSON",
      fix: "ge evals compile   (emits .ge/behavioral/bench-profile.json), or pass --sessions/--turns directly",
    });
  }
  return profile;
}
