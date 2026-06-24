// Pure reducer: ledger frames → ordered stage timeline + run-level signals.
//
// This is the framework-agnostic heart of the live-follow surface. The React hook
// (apps/console/src/hooks/useRunStream.ts) owns the EventSource wiring + refs +
// rendering; it delegates the actual frame→state reduction to the functions here.
// No React, no DOM.

import { normalizeStatus } from "./status.mjs";
import { STAGE_LOG_TYPE, RUN_COMPLETE_TYPE, STAGE_ERROR_TYPE } from "./frames.mjs";

// Canonical pipeline order. Any stage the events mention that isn't here is
// appended in first-seen order, so unknown/extra stages still render.
export const CANONICAL_ORDER = ["interview", "data", "build", "repair", "deploy"];

export function parseTs(ts) {
  if (!ts) return undefined;
  const t = new Date(ts).getTime();
  return Number.isFinite(t) ? t : undefined;
}

// A fresh, mutable reduction accumulator. The consumer keeps one of these per run
// (e.g. in refs) so reconnect replays don't reset progress.
export function createRunAccumulator() {
  return {
    stages: new Map(),
    firstSeen: [],
    signals: { active: null, status: "pending", blockedReason: null, complete: false },
  };
}

// Reduce a single ledger event into the mutable stage map + run-level signals.
// Returns { tailLine? } for the (rare) case a caller wants a derived line.
export function applyEvent(ev, stages, signals) {
  const ts = parseTs(ev.ts);
  const stageName = ev.stage || undefined;
  let tailLine;

  if (stageName) {
    const existing = stages.get(stageName) || { id: stageName, name: stageName, status: "pending" };
    switch (ev.type) {
      case "stage_planned":
        if (existing.status === "pending") existing.status = "pending";
        break;
      case "stage_started":
        existing.status = "running";
        existing.startedAt = existing.startedAt ?? ts;
        signals.active = stageName;
        if (signals.status !== "failed" && signals.status !== "blocked") signals.status = "running";
        break;
      case "stage_done":
        existing.status = "done";
        existing.endedAt = ts;
        if (signals.active === stageName) signals.active = null;
        break;
      case STAGE_ERROR_TYPE:
      case "stage_failed":
        // A failed stage is "blocked" if it carries an error needing a human,
        // else terminal-failed. The ledger uses stage_failed/stage_error for
        // both; we treat a present error as the blocker reason and surface a
        // blocked state so Resume is offered, falling back to failed. stage_error
        // is the worker's real-throw frame (message in `error`, full stack/cmd in
        // `data`) and renders through the identical "failed" path.
        existing.status = ev.status === "blocked" || ev.status === "pending_approval" ? "blocked" : "failed";
        existing.endedAt = ts;
        if (existing.status === "blocked") {
          signals.status = "blocked";
          signals.blockedReason = ev.error || existing.lastLine || "Run is blocked and needs attention.";
        } else {
          signals.status = "failed";
          signals.blockedReason = ev.error || ev.data?.message || signals.blockedReason;
        }
        break;
      default:
        // status-bearing frame without an explicit type → normalize it
        if (ev.status) existing.status = normalizeStatus(ev.status);
        break;
    }
    if (ev.error && !existing.lastLine) existing.lastLine = ev.error;
    stages.set(stageName, existing);
  }

  if (ev.type === RUN_COMPLETE_TYPE) {
    signals.complete = true;
    signals.active = null;
    // Trust the terminal frame for overall status.
    if (ev.ok === false || ev.status === "failed") signals.status = "failed";
    else if (ev.status) signals.status = normalizeStatus(ev.status);
    else if (signals.status !== "failed" && signals.status !== "blocked") signals.status = "done";
  }

  return { tailLine };
}

// Materialise the mutable stage map into an ordered, render-ready array. `now` is
// injectable for deterministic tests; defaults to Date.now().
export function orderStages(stages, firstSeen, now = Date.now()) {
  const seen = new Set(stages.keys());
  const ordered = [];
  for (const name of CANONICAL_ORDER) if (seen.has(name)) ordered.push(name);
  for (const name of firstSeen) if (seen.has(name) && !ordered.includes(name)) ordered.push(name);
  return ordered.map((name) => {
    const s = stages.get(name);
    const elapsedMs = s.startedAt ? (s.endedAt ?? (s.status === "running" ? now : s.startedAt)) - s.startedAt : 0;
    return { id: s.id, name: s.name, status: s.status, startedAt: s.startedAt, endedAt: s.endedAt, elapsedMs: Math.max(0, elapsedMs), lastLine: s.lastLine };
  });
}

// Is this a live command-output frame (text rides in data.lines)? The reducer
// caller feeds those straight to the rolling tail and skips status reduction.
export function isStageLogFrame(ev) {
  return ev?.type === STAGE_LOG_TYPE;
}
