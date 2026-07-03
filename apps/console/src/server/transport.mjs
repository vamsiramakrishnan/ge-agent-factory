// Console transport facade. The five transports live in ./transport/*, each a
// verbatim extraction pinned by transport-oracle.test.mjs (and the pre-existing
// transport.test.mjs); this module keeps the import surface the router, tests,
// and siblings already use:
//
//   transport/jobs.mjs      — daemon job submit/stream + traced local fallback
//   transport/repair.mjs    — repair orchestration (daemon task or local)
//   transport/doctor.mjs    — doctor daemon proxy + subprocess report replay
//   transport/ledger.mjs    — durable run-ledger SSE (local SQLite / Firestore)
//   transport/logs.mjs      — raw NDJSON log tailing
//   transport/sse.mjs       — shared reconnect-safe SSE writer plumbing
//   transport/daemon.mjs    — daemon base URL
//   transport/paths.mjs     — REPO_ROOT / GE_CLI anchors

import * as core from "../../../../tools/lib/factory-core.mjs";

export { startGeJob, getJob, listJobs, streamJob } from "./transport/jobs.mjs";
export {
  startRepairRun,
  resumeRepairRun,
  getRepair,
  listRepairs,
  getRepairEvents,
} from "./transport/repair.mjs";
export { streamDoctor } from "./transport/doctor.mjs";
export { streamLedger, __setFirestoreLedgerReaderForTest } from "./transport/ledger.mjs";
export { streamLogs } from "./transport/logs.mjs";

// Parse an incoming request into the handler's req shape. bodyText may be "".
export async function toApiReq(method, url, bodyText) {
  const u = new URL(url, "http://localhost");
  const query = Object.fromEntries(u.searchParams.entries());
  let body = null;
  if (bodyText) { try { body = JSON.parse(bodyText); } catch { body = null; } }
  return { method, path: u.pathname, query, body };
}

export { core };
