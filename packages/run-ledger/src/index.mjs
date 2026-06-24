// @ge/run-ledger — a standalone "follow any long-running pipeline" observability
// primitive: a durable run/stage ledger + the SSE frame/event schema + status
// normalization + a pure frames→state reducer.
//
// Framework-agnostic by construction: NO React, NO JSX, NO DOM/EventSource. The
// Firestore backend lazy-imports @google-cloud/firestore and lives behind the
// `@ge/run-ledger/firestore` subpath, so consumers that only need the
// types/reducer/SQLite store never pull a cloud dependency.
//
// Layout:
//   .            → store (createRunLedger + adapters), status, frames, reducer
//   ./firestore  → the Firestore reader/mirror backend (lazy cloud dep)
//   ./status     → normalizeStatus + RunStatus (also re-exported here)
//   ./frames     → LedgerEvent schema + nextEventSeq + stage_log helpers
//   ./reduce     → applyEvent / orderStages / createRunAccumulator (pure)

export * from "./store.mjs";
export * from "./status.mjs";
export * from "./frames.mjs";
export * from "./reduce.mjs";
