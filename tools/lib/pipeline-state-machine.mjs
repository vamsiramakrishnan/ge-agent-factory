// Pipeline state machine (ADR 0001, phase 4).
//
// One authoritative answer to "what should happen next for this work item?",
// derived purely from (current stage, status, target stage, mode). build / handoff /
// regenerate stop being bespoke code paths and become transitions over this
// machine; the local harness, the remote worker, and the planners all agree on
// the same ordering and the same next action. Pure and exhaustively testable.

import { LEDGER_STAGES } from "./ledger/run-ledger.mjs";

export const STAGES = LEDGER_STAGES;

// The last pre-cloud stage. Stages up to and including this run on the local
// harness; everything after is cloud-only (deploy / register / publish).
export const BUILD_BOUNDARY = "previewed";

const idx = (stage) => STAGES.indexOf(stage);
const BOUNDARY_IDX = idx(BUILD_BOUNDARY);

// Which side owns a stage: "local" (≤ build boundary) or "cloud" (after it).
export function stageOwner(stage) {
  const i = idx(stage);
  if (i === -1) return "unknown";
  return i <= BOUNDARY_IDX ? "local" : "cloud";
}

// The stage immediately after `current`, capped at `target`. null when already
// at/over the target (nothing left to advance).
export function nextStage(current, target) {
  const ci = idx(current ?? "planned");
  const ti = idx(target);
  if (ci === -1 || ti === -1) return null;
  if (ci >= ti) return null;
  return STAGES[ci + 1];
}

export function isTerminal({ stage, status } = {}, target) {
  if (status === "failed") return false;
  const ci = idx(stage ?? "planned");
  const ti = idx(target);
  return ci !== -1 && ti !== -1 && ci >= ti;
}

// The next action for one work item. Actions:
//   none           — at/over target, nothing to do (terminal)
//   retry          — current stage failed; re-run it
//   build_local    — advance one local stage on this machine
//   handoff        — local is done to the boundary; hand off to the cloud
//   advance_remote — let the cloud worker advance the next stage (remote mode)
export function planWorkItem({ stage = "planned", status = "pending" } = {}, { targetStage = "published", mode = "local" } = {}) {
  const current = stage || "planned";
  const base = { currentStage: current, targetStage, mode };

  if (status === "failed") {
    return { ...base, action: "retry", nextStage: current, owner: stageOwner(current), terminal: false, reason: `${current} failed — retry` };
  }
  if (isTerminal({ stage: current, status }, targetStage)) {
    return { ...base, action: "none", nextStage: null, owner: stageOwner(current), terminal: true, reason: `at target ${targetStage}` };
  }

  const next = nextStage(current, targetStage);
  const owner = stageOwner(next);

  if (mode === "remote") {
    return { ...base, action: "advance_remote", nextStage: next, owner, terminal: false, reason: `cloud factory advances → ${next}` };
  }
  // local mode
  if (owner === "local") {
    return { ...base, action: "build_local", nextStage: next, owner, terminal: false, reason: `build → ${next} on this machine` };
  }
  // local mode, next stage is past the build boundary → must ship to the cloud
  return { ...base, action: "handoff", nextStage: next, owner, terminal: false, reason: `past build boundary — hand off to the cloud for ${next}` };
}

// A reset (regenerate) transition: wind a work item back to `created` so the
// pipeline rebuilds it from scratch. Modeled as a transition, not filesystem
// surgery — callers also do the side effects (wipe workspace, re-enqueue).
export const RESET_STAGE = "created";
export function resetTransition(workItemId) {
  return { workItemId, stage: RESET_STAGE, status: "reset" };
}

// Pure reducer: fold a transition into a work-item state. Mirrors the ledger's
// materialisation (advance the stage forward only; a reset rewinds it). Lets the
// machine be tested over an event sequence independent of storage.
export function applyTransition(state = { stage: null, status: "pending" }, transition = {}) {
  const { stage = null, status = "pending", error = null } = transition;
  if (status === "reset") {
    return { stage: RESET_STAGE, status: "reset", error: null };
  }
  const advance = stage && (state.stage == null || idx(stage) >= idx(state.stage));
  return {
    stage: advance ? stage : state.stage,
    status,
    error: status === "failed" ? error : null,
  };
}

// Fold a whole transition sequence (e.g. a run's events) into final state.
export function reduceTransitions(transitions = []) {
  return transitions.reduce((state, t) => applyTransition(state, t), { stage: null, status: "pending" });
}
