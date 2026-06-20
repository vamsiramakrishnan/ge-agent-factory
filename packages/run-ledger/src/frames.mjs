// Frame / event schema + the monotonic seq allocator.
//
// A "frame" is one ledger event as it rides over SSE / Firestore: { seq, ts, type,
// stage, status, workItemId, error, data }. The shape is shared by the worker
// (writer), the Firestore mirror, and the console reducer (reader) so they can
// never drift. This module is pure (no fs, no network, no framework).

// Live command-output frames carry their text in data.lines (the cloud ledger
// normalizer preserves `data` but drops unknown top-level fields).
export const STAGE_LOG_TYPE = "stage_log";
export const RUN_COMPLETE_TYPE = "run_complete";

// Process-local MONOTONIC seq for event docs. The cloud ledger normalizer prefers
// `data.seq` over snapshot position, so writing a real, strictly-increasing seq on
// every event doc stops live frames from being dropped/duplicated when a doc
// arrives with an earlier `ts` (clock skew / same-second interleave). A wall-clock
// base (µs) orders docs across stage processes by time; a monotonic counter keeps
// it strictly increasing within a process even on same-instant writes.
let _lastSeq = 0;
export function nextEventSeq() {
  // Time base (µs) orders across stage processes by wall-clock; the max(...) guard
  // guarantees strict monotonicity within a process even on same-ms / clock-stall
  // bursts (never resets, never collides).
  _lastSeq = Math.max(_lastSeq + 1, Date.now() * 1000);
  return _lastSeq;
}

// Extract the log lines out of a stage_log frame's data (data.lines[] preferred,
// data.line as a single-line fallback). Returns string[].
export function stageLogLines(frame) {
  const data = frame?.data;
  if (Array.isArray(data?.lines)) return data.lines.filter((l) => typeof l === "string");
  if (typeof data?.line === "string") return [data.line];
  return [];
}

// Build the data payload for a stage_log frame from a batch of output lines.
export function stageLogFrameData(lines) {
  return { lines };
}
