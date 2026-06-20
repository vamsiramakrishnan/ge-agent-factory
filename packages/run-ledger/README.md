# @ge/run-ledger

A standalone, framework-agnostic **"follow any long-running pipeline"** observability
primitive. It is the durable run/stage **ledger** + the SSE **frame/event schema** +
**status normalization** + a pure **frames→state reducer** that power the GE console's
live Run Drawer and the factory worker's log-tap — extracted so the same model can
follow any Cloud Tasks / Cloud Run Jobs / multi-stage pipeline.

There is **no React, no JSX, no DOM, no EventSource** in this package. The Firestore
backend lazy-imports `@google-cloud/firestore` and lives behind a subpath, so a
consumer that only needs the types / reducer / SQLite store never pulls a cloud
dependency.

## What's in here

| Subpath | Purpose |
| --- | --- |
| `@ge/run-ledger` | Everything below except the Firestore backend (store + status + frames + reducer). |
| `@ge/run-ledger/firestore` | The Firestore reader/mirror backend (lazy cloud dep). |
| `@ge/run-ledger/status` | `normalizeStatus` + the `RunStatus` vocabulary. |
| `@ge/run-ledger/frames` | The `LedgerEvent` schema + `nextEventSeq` + `stage_log` helpers. |
| `@ge/run-ledger/reduce` | `applyEvent` / `orderStages` / `createRunAccumulator` (pure reducer). |

### The ledger store (`createRunLedger`)

Event-sourced: **runs → work items → stage events**, with idempotent transitions
(replaying the same transition is a no-op) and projections (`getRun`, `listRuns`,
`events`, `fleetByUseCase`) that match the console's read contracts. A monotonic
per-run `seq` drives SSE reconnect/dedup.

Storage is behind a tiny **`LedgerStore`** adapter — `{ run, all, get, close }` — so the
same logic runs on:

- **SQLite** locally + in tests (`sqliteAdapter`, via `bun:sqlite` or `better-sqlite3`),
- **Postgres / AlloyDB** in the cloud control plane (`pgAdapter`, lazy-imports `pg`),
- **Firestore** as a live-push backend (`@ge/run-ledger/firestore`, lazy-imports
  `@google-cloud/firestore`).

`openRunLedger()` is best-effort: it returns `null` if no SQLite driver is available,
so callers can transparently fall back to legacy file stores.

### The frame schema (`@ge/run-ledger/frames`)

A **frame** is one ledger event as it rides over SSE / Firestore:

```ts
interface LedgerEvent {
  seq?: number; ts?: string; type: string;
  stage?: string | null; status?: string;
  workItemId?: string | null; error?: string | null;
  data?: Record<string, any> | null; ok?: boolean | null;
}
```

`nextEventSeq()` is a process-local **monotonic** allocator (µs wall-clock base +
strict-increment guard) so live frames are never dropped/duplicated under clock skew.
Live command output rides in `data.lines` (`stage_log` frames); use `stageLogLines()`
to read them back.

### Status normalization (`@ge/run-ledger/status`)

`normalizeStatus(raw)` folds the many verbs the factory/runtime/ledger emit (`queued`,
`in_progress`, `pending_approval`, `cancelled`, `timed_out`, …) into one small
vocabulary: **`pending | running | blocked | done | failed`**. Cancelled/aborted/
timeout map to `failed` (not `pending`). The Tailwind palette + the JSX `StatusChip`
stay in the console.

### The pure reducer (`@ge/run-ledger/reduce`)

`applyEvent(ev, stages, signals)` folds a single frame into a mutable accumulator;
`orderStages(stages, firstSeen, now?)` materialises an ordered, render-ready
timeline. Keep one `createRunAccumulator()` per run (e.g. in React refs) so reconnect
replays don't reset progress. `now` is injectable for deterministic tests.

## Example

```js
import { openRunLedger } from "@ge/run-ledger";
import { createRunAccumulator, applyEvent, orderStages } from "@ge/run-ledger/reduce";

// Write side (a worker / orchestrator):
const ledger = await openRunLedger("/var/lib/ge/ledger.sqlite");
ledger.startRun({ id: "run-42", total: 1 });
ledger.recordTransition({ runId: "run-42", workItemId: "uc1", stage: "build", status: "started" });
ledger.recordTransition({ runId: "run-42", workItemId: "uc1", stage: "build", status: "done" });
ledger.completeRun({ runId: "run-42", ok: true });

// Read side (a follow surface): reduce the event tail into a timeline.
const acc = createRunAccumulator();
for (const frame of ledger.events("run-42", { afterSeq: 0 })) {
  acc.firstSeen.push(frame.stage);
  applyEvent(frame, acc.stages, acc.signals);
}
console.log(acc.signals.status);              // "done"
console.log(orderStages(acc.stages, acc.firstSeen)); // ordered stage views
```
