// Compile-time exercise of the @ge/run-ledger type surface. Never executed:
// the per-package `typecheck` script (`bunx tsc --noEmit -p .`) checks this
// file against the package's .d.ts declarations so the declared types stay
// honest — a .d.ts nobody compiles against is theater.
//
// Mirrors the runtime usage in src/index.test.mjs (in-memory adapter driving
// the full ledger surface) plus the reducer/frames round-trip the console does.

import {
  LEDGER_STAGES,
  factoryEventToLedgerOp,
  createRunLedger,
  sqliteAdapter,
  openRunLedger,
  normalizeStatus,
  RUN_STATUSES,
  nextEventSeq,
  stageLogLines,
  stageLogFrameData,
  isStageLogFrame,
  STAGE_LOG_TYPE,
  createRunAccumulator,
  applyEvent,
  orderStages,
  parseTs,
  CANONICAL_ORDER,
} from "@ge/run-ledger";
import type { RunStatus } from "@ge/run-ledger/status";
import type { LedgerEvent } from "@ge/run-ledger/frames";
import type {
  LedgerAdapter,
  LedgerOp,
  RunLedger,
  RunSummary,
  FleetWorkItemState,
} from "@ge/run-ledger";
import {
  normalizeFirestoreLedgerEvent,
  createFirestoreLedgerReader,
  createFirestoreEventMirror,
  type FirestoreCollectionLike,
  type FirestoreDatabaseLike,
} from "@ge/run-ledger/firestore";

// ── status vocabulary ─────────────────────────────────────────────────────────
const status: RunStatus = normalizeStatus("in_progress");
const allStatuses: readonly RunStatus[] = RUN_STATUSES;

// @ts-expect-error "cancelled" is raw jargon, not part of the normalized RunStatus vocabulary
const badStatus: RunStatus = "cancelled";

// ── frames + pure reducer round-trip (what the console's useRunStream does) ───
const acc = createRunAccumulator();
applyEvent(
  { type: "stage_started", stage: "build", ts: "2026-01-01T00:00:00.000Z" },
  acc.stages,
  acc.signals,
);
const view = orderStages(acc.stages, acc.firstSeen, parseTs("2026-01-01T00:00:05.000Z"));
const firstStage: string | undefined = view[0]?.name;
const canonical: string[] = CANONICAL_ORDER;

const logFrame: LedgerEvent = {
  type: STAGE_LOG_TYPE,
  seq: nextEventSeq(),
  data: stageLogFrameData(["line one"]),
};
const logLines: string[] = stageLogLines(logFrame);
const isLog: boolean = isStageLogFrame(logFrame);

// ── the ledger itself over an in-memory adapter (mirrors src/index.test.mjs) ──
const stages: readonly string[] = LEDGER_STAGES;

const rows: Record<string, unknown>[] = [];
const adapter: LedgerAdapter = {
  run(_sql: string, _params: ReadonlyArray<string | number | null> = []): void {},
  all(_sql: string, _params: ReadonlyArray<string | number | null> = []) {
    return rows;
  },
  get(_sql: string, _params: ReadonlyArray<string | number | null> = []) {
    return rows[0] ?? null;
  },
  close(): void {},
};

const ledger = createRunLedger(adapter).migrate();
ledger.startRun({
  id: "run-1",
  mode: "local",
  kind: "build",
  targetStage: "deployed",
  total: 1,
  startedAt: "2026-01-01T00:00:00.000Z",
});
ledger.recordTransition({
  runId: "run-1",
  workItemId: "uc1",
  useCaseId: "uc1",
  stage: "created",
  status: "started",
  ts: "2026-01-01T00:00:01.000Z",
});

// The mistakes the store types must catch:
// @ts-expect-error "finished" is not a LedgerTransitionStatus (started/done/failed/reset/submitted)
ledger.recordTransition({ runId: "run-1", workItemId: "uc1", status: "finished" });
// @ts-expect-error status is required on a transition
ledger.recordTransition({ runId: "run-1", workItemId: "uc1" });
// @ts-expect-error startRun requires an id (it throws at runtime without one)
ledger.startRun({ mode: "local" });

// factoryEventToLedgerOp output feeds back into the ledger exactly the way
// applyFactoryEvent does internally.
const op: LedgerOp | null = factoryEventToLedgerOp({
  type: "stage_done",
  stage: "created",
  useCaseId: "uc1",
  ts: "2026-01-01T00:00:02.000Z",
});
if (op && op.kind === "transition") {
  // Narrowed branch: the mapper only emits started/done/failed transitions.
  const mapped: "started" | "done" | "failed" = op.status;
  void mapped;
  const { kind, ...transition } = op;
  ledger.recordTransition({ runId: "run-1", ...transition });
}
if (op && op.kind === "complete") {
  const ok: boolean | null = op.ok;
  void ok;
}
ledger.applyFactoryEvent("run-1", { type: "run_done", ok: true, ts: "2026-01-01T00:00:03.000Z" });
ledger.completeRun({ runId: "run-1", ok: true, finishedAt: "2026-01-01T00:00:03.000Z" });

// Ledger events ride straight into the pure reducer (same LedgerEvent schema).
for (const ev of ledger.events("run-1", { afterSeq: 0, limit: 100 })) {
  applyEvent(ev, acc.stages, acc.signals);
}

const run: RunSummary | null = ledger.getRun("run-1");
const runStatus: RunStatus | undefined = run?.status;
const stageName: string | undefined = run?.results[0]?.stages[0]?.name;
const runsList: RunSummary[] = ledger.listRuns({ limit: 5 });
const fleet: Map<string, FleetWorkItemState> = ledger.fleetByUseCase();
ledger.recordReset({ runId: "run-1", workItemId: "uc1" });
ledger.recordRemoteSubmission({
  runId: "remote-1",
  targetStage: "deployed",
  items: [{ id: "uc1", useCaseId: "uc1", title: "UC 1" }],
});
ledger.ingestFactoryRun({
  id: "run-2",
  startedAt: "2026-01-01T00:00:00.000Z",
  results: [{ useCaseId: "uc1", status: "deployed", stages: [{ name: "created", status: "done" }] }],
});
ledger.backfill({
  stateJson: { completed: { uc1: { runId: "r-9", workspaceId: "ws-1" } }, failed: {} },
  factoryRuns: [],
});
ledger.close();

// ── adapters open asynchronously ──────────────────────────────────────────────
async function openAdapters(): Promise<void> {
  const sqlite: LedgerAdapter = await sqliteAdapter(":memory:");
  createRunLedger(sqlite);
  // Best-effort open: null when no sqlite driver is available.
  const maybeLedger: RunLedger | null = await openRunLedger(":memory:");
  if (maybeLedger) maybeLedger.listRuns({ limit: 1 });
}
void openAdapters;

// ── firestore backend (lazy cloud subpath) ────────────────────────────────────
const normalized: LedgerEvent = normalizeFirestoreLedgerEvent(
  { id: "1", data: () => ({ type: "stage_done", stage: "build", seq: 1 }) },
  0,
);
void normalized;

// A plain-object fake database, the way firestore.mjs's tests inject one.
const fakeCollection: FirestoreCollectionLike = {
  get: async () => ({ docs: [] }),
  doc: (_id: string) => ({
    collection: (_name: string) => fakeCollection,
    get: async () => ({ exists: false }),
  }),
};
const fakeDb: FirestoreDatabaseLike = { collection: (_name: string) => fakeCollection };

async function readFirestore(): Promise<void> {
  const reader = await createFirestoreLedgerReader({ projectId: "demo", db: fakeDb });
  const events: LedgerEvent[] = await reader.events("run-1", { afterSeq: 0 });
  const summary: RunSummary | null = await reader.getRun("run-1");
  const unsubscribe: (() => void) | null = reader.listenEvents(
    "run-1",
    { afterSeq: 0 },
    (next: LedgerEvent[]) => void next,
  );
  void events;
  void summary;
  void unsubscribe;

  const mirror = await createFirestoreEventMirror({ projectId: "demo" });
  await mirror.applyFactoryEvent("run-1", { type: "stage_done", stage: "build" });
  await mirror.completeRun("run-1", { ok: true });
}
void readFirestore;

// Referenced-but-unused sinks (this file only exists to be type-checked).
void status;
void allStatuses;
void badStatus;
void firstStage;
void canonical;
void logLines;
void isLog;
void stages;
void run;
void runsList;
void fleet;
