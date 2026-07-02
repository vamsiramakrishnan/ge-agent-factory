# 09 — Cloud factory: audit verdict and the reliability/speed/elegance workplan

Read-only audit of the remote control plane (2026-07-02), facts verified with
file:line evidence. Verdict up front: **the primitive choices are right and
several mechanisms are textbook** — but the system is *half-wired*: managed
services were bought and their managed benefits (events, deadlines,
transactions) left on the table. Author workstreams from this file using
`TEMPLATE.md`; house rules in `00-orchestration.md` bind, and rule 4
(never blind-ship into the deploy path) applies to almost everything here —
these workstreams need a live GCP project for verification, so they are
**plan-and-parse-verify here, execute-and-verify in a provisioned env**.

## What is genuinely good (protect these)

- **The Cloud Tasks ACK contract** (`apps/factory/scripts/factory-worker.mjs:38-52`):
  permanent stage failures ACK 200 (recorded in the ledger, no poison loops),
  only transient failures 503 for redelivery — born from real incident
  `run-m9anhe-9393`, memorialized in `installer/terraform/tasks.tf:10-15`
  with tuned `retry_config`.
- **Deterministic task names as dedup keys** (`factory-worker.js:384-392`)
  with 409 ALREADY_EXISTS treated as success — idempotent enqueue.
- **Terraform covers the core estate** (19 .tf files: Cloud Run v2 ×4, queue,
  Firestore, AR, AlloyDB+Secret Manager DSN, Bigtable, SAs, IAM, IAP chain)
  with a documented ownership contract (OPERATIONS.md:210-220).
- **The builder image's warm uv cache** attacks the actual bottleneck
  (dependency install per stage), and Cloud Build `logUrl` is plumbed into
  failure records → `ge logs` — failed-stage forensics work.

## The gaps (each → one workstream; ordered by severity × cheapness)

### C1. Timeout triangle is broken — `S`, pure Terraform/code constants
No `httpTarget.dispatchDeadline` is set anywhere; Cloud Tasks defaults to
10 min while the worker's Cloud Run timeout is 1800s (`cloud_run.tf:13`) and
`max_retry_duration="600s"` (`tasks.tf:17`). Consequence: any stage running
longer than 10 minutes gets a **duplicate concurrent redelivery** while
attempt 1 still executes, and the retry window expires before long
transients can retry.
**Fix:** set dispatchDeadline (max 1800s) on task creation, drop
`max_retry_duration` in favor of `max_attempts`-only bounding, and assert the
invariant `dispatchDeadline ≥ Cloud Run timeout ≥ longest stage` in a unit
test over the constants.

### C2. The events topic is a black hole — `S/M`
`ge-agent-factory-events` has publishers only (`factory-worker.js:590`,
`factory-bridge.js:661`) — zero subscriptions, zero subscriber code, and the
topic isn't in Terraform or `ge cutover`'s import list. Every publish is
dropped; the ADR's "run-events fan out to console" (adr/0001:79-80) is
unimplemented; meanwhile the gateway polls a GCS snapshot every 4s
(`factory-bridge.js:812-840`).
**Fix:** put the topic in Terraform + cutover imports, add one push
subscription feeding the console transport (the `@ge/run-ledger` reducer
already consumes frames), delete the 4s poll. If nobody wants it within a
sprint: delete the publishers instead — a topic nobody reads is jargon in
infrastructure form.

### C3. Ledger writes are fire-and-forget — `M`, the reliability keystone
`recordStageEvent` = 3 sequential non-transactional Firestore PATCHes + a
publish (`factory-worker.js:543-590`); `patchFirestoreDocument` errors are
returned and **ignored by every caller** (:353-368); missing token →
silently `{skipped:true}`. A crash/auth blip leaves runs stuck `running`
forever — the ADR's own open question (adr/0001:198).
**Fix:** (a) Firestore `commit` API for transactional stage transitions;
(b) surface write failures through the tier-2 warn convention WS6
established; (c) a **reconciliation sweeper** — Cloud Scheduler → worker
endpoint — that marks stages `running` past their deadline as `stale` and
enacts `planWorkItem`'s `retry` action. This finally gives `RETRY_POLICIES`
(currently declared dead metadata, `factory-orchestration.js:3-8`) a
consumer, and gives dead runs a redrive path that doesn't depend on the
operator's local `.ge-state.json`.

### C4. No per-agent mutual exclusion — `M`
`submitFactoryRun` mints random runIds and enqueues unconditionally
(`factory-bridge.js:514`); release stages target deterministic per-agent
cloud resources (`_AGENT_NAME`, `factory-worker.js:117`). Two concurrent runs
for one agent race on the same Agent Runtime deploy/registration. The only
guard is client-side state.
**Fix:** Firestore create-if-absent lease doc per agentId taken at
`plan_deploy`, released at terminal state, sweeper-expired (see C3). Reject
duplicate submissions with the existing 409 semantics.

### C5. Polling ×3 where events exist — `M`, biggest latency win
(a) worker self-re-enqueues a +30s poll task per Cloud Build check — up to
~240 tasks per release stage (`factory-worker.js:920,951`); (b) inside
`poll_runtime` a paid E2_HIGHCPU_8 machine runs `for ATTEMPT in $(seq 1 24)…
sleep 30` (`cloudbuild.factory-stage.yaml:169-183`); (c) the gateway's 4s
GCS poll (C2). Cloud Build already publishes to the `cloud-builds` Pub/Sub
topic on every state change.
**Fix:** subscribe (push → worker endpoint) for build completion; move the
Agent Runtime poll out of Cloud Build into a worker stage against the
operations API with task-based backoff. Stage-transition latency floor drops
from 30–120s to ~1s and the poll-task storm disappears.

### C6. Full-workspace tarball at every stage boundary — `M`
Every one of 14 stages re-tars and re-uploads the whole workspace and the
next stage re-downloads it (`factory-worker.js:686-741`), ~13 round-trips
per agent even when a stage changed one JSON file. The GCS live-log sink is
a read-modify-write of the whole ndjson object per flush with a lost-update
race (`logSink`, :315-351).
**Fix:** content-address the archive (hash → skip upload when unchanged —
most stages change little), and make the log sink append-only objects
(per-flush keys composed on read) or route live logs through C2's
subscription instead of GCS.

### C7. Throughput is silently capped at 10 — `S`
Queue allows 100 concurrent dispatches (`tasks.tf:7`) but the worker is
max 10 instances × concurrency 1 (`cloud_run.tf:14-19`) — fleet-wide
parallelism 10, cold-started from zero. For a 363-agent catalog that is the
whole ballgame.
**Fix:** align the pair explicitly (either raise max_instances or lower
max_concurrent_dispatches to match), set `min_instance_count=1` while a
fleet run is active (the gateway can flip it), and consider per-stage machine
classes — E2 default, HIGHCPU only where validate/preview need it.

### C8. Drift islands vs "Terraform owns Cloud Run" — `S/M`
Two conflicting worker specs live in-repo: Terraform's 8CPU/32Gi
(`cloud_run.tf:25-27`) vs a provision step's `gcloud run deploy` with
2Gi/2CPU + inline env (`factory-orchestration.js:333-355`); `ge mcp deploy`
raw-gcloud-deploys 5 services (`tools/lib/planes/mcp-plane.mjs:82`); the
Pub/Sub topic is gcloud-only. OPERATIONS.md's troubleshooting table records
the incidents this class already caused.
**Fix:** delete the stale provision-step spec (Terraform is the owner —
that's already the documented contract), move MCP services + topic into
Terraform, keep `ge cutover` as the import path.

### C9. Observability is prose, not structure — `S`
No Trace/Error Reporting/OTel anywhere; logs are single-line
`console.error("[factory-worker] …")` strings.
**Fix (cheap first step):** emit one JSON object per log line
(`{severity, runId, itemId, stage, attempt, message}`) — Cloud Logging
indexes it automatically and every stage's logs become queryable by runId
with zero infra. Error Reporting picks up stack traces from structured
`severity: ERROR` for free. OTel can wait.

### C10. Retry classification is a stderr regex — `M`, pairs with C3
`TRANSIENT_FAILURE_RE` (`factory-worker.js:26`) decides transient vs
permanent. Any unmatched transient = permanent failure; any deterministic
error containing "429" = 5 wasted retries.
**Fix:** stages already return `{retryable}` — push classification down to
the operation sites (gcloud exit-code + HTTP status based, not stderr text),
and make `RETRY_POLICIES` the declared source the sweeper (C3) consults.

## Sequencing

Wave C-1 (config-only, parse-verifiable here): C1, C7, C9, C8's spec
deletion. Wave C-2 (needs live env): C2, C5. Wave C-3: C3+C10 together (the
reliability keystone), then C4, C6. Everything in C-2/C-3 lands behind
`CANARY=1 mise run bootstrap` verification in a real project per house rule 4.
