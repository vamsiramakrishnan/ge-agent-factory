// Status normalization — the framework-agnostic part of the run status system.
//
// Normalizes the many status verbs the factory/runtime/ledger emit into one small
// vocabulary: pending | running | blocked | done | failed. This is pure data + a
// pure function; the JSX chip and the Tailwind palette stay in the console
// (apps/console/src/lib/runStatus.tsx) and import normalizeStatus + RunStatus from
// here.

// The canonical status vocabulary. (Type lives in status.d.ts as RunStatus.)
export const RUN_STATUSES = ["pending", "running", "blocked", "done", "failed"];

export const STATUS_MAP = {
  // pending / not-yet-started
  pending: "pending",
  queued: "pending",
  planned: "pending",
  none: "pending",
  submitted: "pending",
  created: "pending",
  // running
  running: "running",
  active: "running",
  in_progress: "running",
  // blocked / needs human
  blocked: "blocked",
  pending_approval: "blocked",
  paused: "blocked",
  // done
  done: "done",
  complete: "done",
  completed: "done",
  passed: "done",
  ok: "done",
  success: "done",
  skipped: "done",
  // failed — including terminal cancelled/aborted/timeout states, which are
  // *not* about-to-start. (Without these they fell through to "pending" and a
  // cancelled/timed-out run rendered as slate ○ and counted as "Active".)
  failed: "failed",
  error: "failed",
  cancelled: "failed",
  canceled: "failed",
  aborted: "failed",
  interrupted: "failed",
  timed_out: "failed",
  timeout: "failed",
};

export function normalizeStatus(raw) {
  const key = String(raw || "").toLowerCase().replace(/[-\s]+/g, "_").trim();
  return STATUS_MAP[key] || "pending";
}
