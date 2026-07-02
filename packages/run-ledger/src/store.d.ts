// Type surface for store.mjs — the durable run/stage ledger core.
// Every property below traces to a line in store.mjs that reads or writes it.
import type { LedgerEvent } from "./frames";
import type { RunStatus } from "./status";

// ── canonical stages ──────────────────────────────────────────────────────────
// Ordered pipeline stages (mirrors FACTORY_STAGES in the generator).
export declare const LEDGER_STAGES: readonly string[];

// ── SQL adapter contract ──────────────────────────────────────────────────────
// Parameter values the store binds into statements (strings, numbers, NULLs).
export type SqlValue = string | number | null;

// One row as returned by the SQL driver. The column set depends on the query
// (ledger_runs / ledger_work_items / ledger_events / aggregates like MAX(seq)),
// so the adapter contract keeps rows dynamic; the ledger's own methods narrow
// what they read from each query.
export type LedgerRow = Record<string, unknown>;

// The storage adapter behind the ledger: `{ run, all, get, close }` over SQL.
// The contract is synchronous: createRunLedger reads `all`/`get` results
// inline (never awaits them), which is why the SQLite adapters
// (bun:sqlite / better-sqlite3) are the only implementations.
export interface LedgerAdapter {
  /** Execute a statement. The return value is driver-specific and never inspected by the ledger. */
  run(sql: string, params?: readonly SqlValue[]): unknown;
  all(sql: string, params?: readonly SqlValue[]): LedgerRow[];
  get(sql: string, params?: readonly SqlValue[]): LedgerRow | null;
  /** Optional on the contract: createRunLedger's close() calls adapter.close?.(). */
  close?(): unknown;
}

// ── factory event → ledger op mapping ─────────────────────────────────────────
// The statuses the store itself writes to ledger_events / ledger_work_items:
// started/done/failed from the generator stream mapping, reset from
// recordReset (regenerate rewind), submitted from recordRemoteSubmission and
// the legacy-state backfill. Distinct from RunStatus (the normalized display
// vocabulary in ./status) — normalizeStatus maps between the two.
export type LedgerTransitionStatus = "started" | "done" | "failed" | "reset" | "submitted";

// A factory-events.jsonl event (the generator's live stream) as read by
// factoryEventToLedgerOp: only the fields the mapper touches are declared;
// events carry more, which the mapper ignores.
export interface FactoryEvent {
  type: string;
  ts?: string;
  /** Work-item identity fallbacks, in workItemIdOf() precedence order. */
  useCaseId?: string | null;
  id?: string | null;
  workspace?: string | null;
  workspaceId?: string | null;
  stage?: string | null;
  targetStage?: string | null;
  total?: number;
  startedAt?: string;
  ok?: boolean | null;
  error?: string | null;
  /** stage_error/stage_failed events may carry the message nested in data. */
  data?: ({ message?: string } & Record<string, unknown>) | null;
  [key: string]: unknown;
}

// The discriminated union factoryEventToLedgerOp emits, one branch per
// event-type group it recognizes (run_started / item_*+stage_* / run_done).
export interface LedgerStartOp {
  kind: "start";
  targetStage: string | null;
  total: number;
  /** event.startedAt || event.ts — undefined when the event carries neither. */
  startedAt?: string;
}
export interface LedgerTransitionOp {
  kind: "transition";
  workItemId: string | null;
  useCaseId: string | null;
  workspaceId: string | null;
  ts?: string;
  /** Absent for item_started/item_failed/item_done (no stage on those events). */
  stage?: string | null;
  /** The mapper only ever emits these three; reset/submitted come from dedicated ledger methods. */
  status: Extract<LedgerTransitionStatus, "started" | "done" | "failed">;
  error?: string;
}
export interface LedgerCompleteOp {
  kind: "complete";
  ok: boolean | null;
}
export type LedgerOp = LedgerStartOp | LedgerTransitionOp | LedgerCompleteOp;

/** Pure mapper from a generator stream event to a ledger op; null for unrecognized/absent events. */
export declare function factoryEventToLedgerOp(
  event: FactoryEvent | null | undefined,
): LedgerOp | null;

// ── ledger method option/result shapes ────────────────────────────────────────
export interface StartRunOptions {
  id: string;
  mode?: string;
  kind?: string;
  targetStage?: string | null;
  scope?: string | null;
  total?: number;
  startedAt?: string;
  /** JSON.stringify'd into the meta column; stored, never inspected by the ledger. */
  meta?: unknown;
}

export interface RecordTransitionOptions {
  runId: string;
  status: LedgerTransitionStatus;
  workItemId?: string | null;
  useCaseId?: string | null;
  title?: string | null;
  department?: string | null;
  workspaceId?: string | null;
  stage?: string | null;
  error?: string | null;
  ts?: string;
  /** JSON.stringify'd into the events data column; stored, never inspected by the ledger. */
  data?: unknown;
}

export interface CompleteRunOptions {
  runId: string;
  ok?: boolean | null;
  finishedAt?: string;
}

// Per-stage display status inside a run summary: itemStages maps recorded
// "started" to "running"; the firestore reader can also surface "unknown"
// when an item document has no status.
export type LedgerStageStatus =
  | "running"
  | Exclude<LedgerTransitionStatus, "started">
  | "unknown";

export interface RunWorkItemSummary {
  id: string;
  useCaseId: string | null;
  title: string | null;
  department: string | null;
  /** The materialized work-item status; "unknown" only via the firestore reader's default. */
  status: LedgerTransitionStatus | "unknown";
  targetStage: string | null;
  workspaceId: string | null;
  error: string | null;
  /** Always [] in ledger summaries (populated only by the legacy file-store shape). */
  systems: unknown[];
  stages: Array<{ name: string; status: LedgerStageStatus }>;
}

export interface RunSummaryEvent {
  ts: string;
  /** stage-scoped events render as `stage_${status}`, run-scoped as the raw status. */
  type: string;
  stage: string | null;
  level: "error" | "info";
  line: string;
}

// What getRun/listRuns return — the run projection consumed by the console.
// The store only ever writes "running"/"done"/"failed" run statuses; typed as
// the shared RunStatus vocabulary from ./status, which is a superset.
export interface RunSummary {
  id: string;
  kind: string;
  mode: string;
  status: RunStatus;
  ok: boolean | null;
  startedAt: string | null;
  updatedAt: string | null;
  finishedAt: string | null;
  targetStage: string | null;
  /** Legacy file-store fields, always null in ledger summaries. */
  planPath: null;
  runPath: null;
  eventsPath: null;
  selected: number;
  failed: number;
  results: RunWorkItemSummary[];
  recentEvents: RunSummaryEvent[];
}

// Latest materialized work-item state per use-case/work-item key (fleet rollups).
export interface FleetWorkItemState {
  runId: string;
  workspaceId: string | null;
  status: LedgerTransitionStatus;
  stage: string | null;
  error: string | null;
  /** snake_case as implemented (compared as strings for recency). */
  updated_at: string;
}

// The completed factory run object (factory-run-*.json) as read by
// ingestFactoryRun — only the fields it touches are declared.
export interface FactoryRunStageRecord {
  name: string;
  status: string;
}
export interface FactoryRunResultRecord {
  id?: string | null;
  useCaseId?: string | null;
  workspace?: string | null;
  title?: string | null;
  department?: string | null;
  workspaceId?: string | null;
  /** Recorded as the final materialized stage for the work item. */
  status?: string;
  error?: string | null;
  stages?: FactoryRunStageRecord[];
  [key: string]: unknown;
}
export interface FactoryRunRecord {
  id?: string | null;
  mode?: string;
  targetStage?: string | null;
  startedAt?: string;
  finishedAt?: string;
  ok?: boolean | null;
  totals?: { workItems?: number } & Record<string, unknown>;
  results?: FactoryRunResultRecord[];
  [key: string]: unknown;
}

export interface RemoteSubmissionItem {
  id?: string | null;
  useCaseId?: string | null;
  title?: string | null;
  department?: string | null;
  workspaceId?: string | null;
  error?: string | null;
  at?: string;
}
export interface RecordRemoteSubmissionOptions {
  runId: string;
  mode?: string;
  kind?: string;
  targetStage?: string | null;
  items?: RemoteSubmissionItem[];
  startedAt?: string;
}

// Legacy .ge-state.json shape consumed by backfill:
// { completed: {agentId: {runId, workspaceId, at}}, failed: {agentId: {error}} }.
export interface LegacyStateJson {
  completed?: Record<string, { runId?: string; workspaceId?: string | null; at?: string }>;
  failed?: Record<string, { error?: string | null }>;
  [key: string]: unknown;
}
export interface BackfillOptions {
  stateJson?: LegacyStateJson | null;
  factoryRuns?: FactoryRunRecord[];
  mode?: string;
}

// ── the ledger itself ─────────────────────────────────────────────────────────
export interface RunLedger {
  /** Apply the schema DDL (idempotent) and return the ledger for chaining. */
  migrate(): RunLedger;
  /** Upsert a run row (status 'running'); returns the run id. */
  startRun(options: StartRunOptions): string;
  /** Append an idempotent event and upsert the work item's materialized state. */
  recordTransition(options: RecordTransitionOptions): RunLedger;
  completeRun(options: CompleteRunOptions): RunLedger;
  getRun(runId: string): RunSummary | null;
  listRuns(options?: { limit?: number }): RunSummary[];
  /** Ordered event tail for live streaming (SSE); afterSeq enables reconnect/dedup. */
  events(runId: string, options?: { afterSeq?: number; limit?: number }): LedgerEvent[];
  /** Latest work-item state keyed by use-case id AND work-item id. */
  fleetByUseCase(): Map<string, FleetWorkItemState>;
  /** Ingest a completed factory run (idempotent); returns the run id, or null for a falsy run. */
  ingestFactoryRun(
    run: FactoryRunRecord | null | undefined,
    options?: { mode?: string; id?: string | null },
  ): string | null;
  /**
   * Apply one live generator event. Returns whatever the underlying op handler
   * returns (startRun's id, recordTransition/completeRun's ledger) or undefined
   * for unrecognized events.
   */
  applyFactoryEvent(
    runId: string,
    event: FactoryEvent | null | undefined,
    options?: { mode?: string },
  ): string | RunLedger | undefined;
  /** Rewind a work item to 'created' via a 'reset' transition (regenerate). */
  recordReset(options: { runId: string; workItemId: string; ts?: string }): RunLedger;
  /** Record a remote provision/ship submission: one run, items in 'submitted'. */
  recordRemoteSubmission(options: RecordRemoteSubmissionOptions): string;
  /** One-time import from the legacy file stores. */
  backfill(options?: BackfillOptions): { runs: number; items: number };
  close(): unknown;
  adapter: LedgerAdapter;
}

export declare function createRunLedger(adapter: LedgerAdapter): RunLedger;

// ── adapter constructors ──────────────────────────────────────────────────────
/** bun:sqlite natively, better-sqlite3 under node. */
export declare function sqliteAdapter(path?: string): Promise<LedgerAdapter>;
/** Best-effort open: SQLite ledger, or null when no driver is available (callers fall back to legacy files). */
export declare function openRunLedger(path?: string): Promise<RunLedger | null>;
