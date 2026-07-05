// tools/lib/planes/run-plane.mjs — the run OBSERVATION plane: one resolver for
// "give me a run ledger reader" so the local SQLite ledger and the remote
// Firestore reader are constructed in exactly one place instead of being
// hand-rolled per consumer.
//
// Why this exists: packages/run-ledger/src/adapter-parity.test.mjs is a
// parity oracle proving the SQLite ledger (createRunLedger, store.mjs) and
// the Firestore reader (createFirestoreLedgerReader, firestore.mjs) satisfy
// the SAME read contract — { events(runId, {afterSeq}), getRun(runId),
// listRuns({limit}) } — read back in the same normalized shape. Two
// consumers (the console's streamLedger in
// apps/console/src/server/transport/ledger.mjs, and `ge runs events --remote`
// in tools/ge/runs.mjs) each independently switched between the two sources
// by hand. That duplication is the seam this module closes: resolveRunLedger
// is the ONE place "local" or "remote" turns into an actual reader, reusing
// the exact constructors each consumer already called (tools/lib/ledger/
// factory-ledger.mjs's cached runLedger() for local, @ge/run-ledger/firestore's
// createFirestoreLedgerReader for remote) — no reimplementation, no behavior
// change.
//
// Deliberately NOT a submission plane. Submitting a run and reading a run's
// ledger are different problems with different input shapes: local
// submission (tools/lib/daemon/detached-submit.mjs) takes a `ge` argv array
// to hand to the runtime daemon, while remote submission (tools/lib/
// provision.mjs's createProvisionOps, driven through the gateway) takes a
// build intent (selected use cases / target stage), not argv. There is no
// shared contract to unify there the way adapter-parity.test.mjs proves one
// for reads — so this module stays read-only, and submission stays wherever
// it already lives.
import { DxError } from "../errors/dx-error.mjs";
import { runLedger } from "../ledger/factory-ledger.mjs";
import { createFirestoreLedgerReader } from "@ge/run-ledger/firestore";

// source: "local" -> the SQLite-backed ledger (tools/lib/ledger/factory-ledger.mjs's
//   runLedger(): a cached, best-effort singleton — null if no sqlite driver is
//   available, exactly as every existing local caller already tolerates).
// source: "remote" -> the Firestore reader (@ge/run-ledger/firestore's
//   createFirestoreLedgerReader, resolving the project from cfg.project when
//   given, or its own defaults — GE_PROJECT / ADC — when not).
// Both satisfy the {events, getRun, listRuns} contract adapter-parity.test.mjs
// pins. Anything else is a programming error, not a runtime condition to
// degrade through — it throws a DxError.
export async function resolveRunLedger({ source, cfg = {}, createLocal = runLedger, createRemote = createFirestoreLedgerReader } = {}) {
  const normalized = String(source || "").trim().toLowerCase();
  if (normalized === "local") return createLocal();
  if (normalized === "remote") return createRemote({ projectId: cfg?.project });
  throw new DxError(`resolveRunLedger: unknown source "${source}"`, {
    where: "resolveRunLedger({ source })",
    why: 'source must be "local" (SQLite) or "remote" (Firestore) — the only two adapters the run-ledger parity oracle covers',
    fix: 'pass source: "local" or source: "remote"',
  });
}
