---
title: Console & APIs
parent: Reference
nav_order: 7
layout: default
---

# Console & APIs

The console is the operator UI over the same engine the `ge` CLI drives —
Pipeline/Journey, Fleet, Activity, Readiness/Doctor, a live Run Drawer, and the
BYO systems flow. Run it with `mise run console` → `http://localhost:18260`. It proxies
the local GE runtime daemon (default port `17654`).

- Views: `apps/console/src/views/`
- Server: `apps/console/src/server/`
- Client: `apps/console/src/services/geClient.ts`

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Views

| File | Shows |
|---|---|
| `Overview.tsx` | Status dashboard: plane cards, reconcile drift, active runtime tasks, quick-start journeys |
| `Journey.tsx` | The Pipeline/Journey wizard (source → configure → review) to launch a build through to a staged target |
| `Fleet.tsx` | All agents with department/stage filters and batch actions (build, ship, sync, repair) |
| `Activity.tsx` | Unified timeline of runs (mission / build / job) with status filters and live tail |
| `Doctor.tsx` | Readiness/health dashboard, scoped to local / cloud / data / mcp, with pass/warn/fail |
| `Autopilot.tsx` | Batch readiness / convergence runs polled from the daemon |
| `Interview.tsx` | The BYO interview UI: form (outcome / systems / constraints) + live spec canvas and grounding docs |
| `SpecReview.tsx` | Standalone spec inspect/edit (`#/spec-review/:usecaseId`) |
| `AgentDetail.tsx` | One agent: journey plan, doctor report, repair actions |

**Run Drawer + "Now" pulse** — `apps/console/src/components/RunDrawer.tsx`, driven
by the `useRunStream` hook (`apps/console/src/hooks/useRunStream.ts`). It follows
any run live, including remote runs, by subscribing to the ledger event SSE stream;
the active stage is the "Now" pulse.

**BYO `SystemsField`** — the systems picker in the interview/journey flow, backed by
`GET /api/systems` and `POST /api/systems/synthesize`.

---

## Server API

Routes are dispatched in `apps/console/src/server/ge-api-router.mjs` (with handlers
in `ge-api.mjs`, `interview-docs.mjs`, `systems.mjs`). `(SSE)` marks a streaming
endpoint.

### `/api/ge/*` — factory core

| Method · Path | Purpose |
|---|---|
| `GET /api/ge/status` | Status board (planes, mode, project, next action) |
| `GET /api/ge/commands` | Available GE commands + metadata |
| `GET /api/ge/specs` | Spec catalog (`q`, `department`, `ids`, `limit`) |
| `GET /api/ge/specs/review` | Inspect a generated spec (`usecaseId` / `path`) |
| `POST /api/ge/specs/register` | Register an interview artifact into the catalog |
| `GET /api/ge/doctor` | Health report (`scope=all\|local\|cloud\|data\|mcp`, `command`) |
| `GET /api/ge/doctor/stream` | Doctor checks (SSE) |
| `GET /api/ge/fleet` | All agents + health/actions |
| `GET /api/ge/journey` | Journey plan (`scenario`, `usecaseId`, `systems`, `ids`, `targetStage`) |
| `GET /api/ge/mission` | Mission execution plan |
| `GET /api/ge/factory/runs` | Factory run summaries (`limit`) |
| `GET /api/ge/ledger/runs` | Durable run ledger (`limit`) |
| `GET /api/ge/ledger/runs/:id` | One ledger run |
| `GET /api/ge/ledger/runs/:id/events` | Live ledger events (SSE) — backs the Run Drawer |
| `GET /api/ge/apply/plan` | Declarative reconcile plan |
| `GET /api/ge/agents/:id` | One agent's detail |
| `GET /api/ge/workspaces/:id/doctor` | Workspace health (`stage`) |
| `POST /api/ge/workspaces/:id/repair` | Local repair loop (`stage`, `attempts`, `agent`, `runPreview`) |
| `GET /api/ge/logs/:runId` | Run logs (`stage`, `item`) |
| `GET /api/ge/runs/:runId/logs` | Run log stream (SSE) |
| `GET /api/ge/runs/:runId/events` | Run event stream (SSE) |
| `GET /api/ge/artifacts/:runId/:item/:name` | Artifact content |
| `GET /api/ge/jobs` · `/:id` · `/:id/logs` | Background jobs; `/logs` is SSE |
| `GET /api/ge/autopilot` · `/:id` · `/:id/events` | Autopilot runs; `/events` takes `afterSeq` |
| `POST /api/ge/autopilot` · `/:id/resume` | Start / resume autopilot |
| `POST /api/ge/mode` | Set mode (`local`\|`remote`) |
| `POST /api/ge/up` · `/data/up` · `/mcp/deploy` | Deploy platform / data plane / MCP services |
| `POST /api/ge/agents/build` · `/ship` · `/sync` | Agent lifecycle (return a jobId; stream via SSE) |

### `/api/runtime/*` — daemon proxy

| Method · Path | Purpose |
|---|---|
| `GET /api/runtime/status` | Daemon health + supported task kinds |
| `GET /api/runtime/tasks` | List tasks (`limit`, `full`) |
| `GET /api/runtime/tasks/:id` | One task |
| `GET /api/runtime/tasks/:id/events` | Task events (SSE or `?format=json`) |
| `POST /api/runtime/tasks` | Start a runtime task (e.g. `mission.run`) |
| `POST /api/runtime/tasks/:id/resume` | Resume a paused task |
| `POST /api/runtime/tasks/:id/interactions/:interactionId` | Answer a runtime form/question |

### `/api/systems/*` — BYO systems

| Method · Path | Purpose |
|---|---|
| `GET /api/systems` | The known built-in simulator options |
| `POST /api/systems/synthesize` | Synthesize a new LIVE simulator (`mode`, `description`, `displayName`, `samples`, `openapi`) and mount it via the overlay |

### `/api/interviews/:id/*` — interview grounding & OKF

| Method · Path | Purpose |
|---|---|
| `GET /api/interviews/:id/documents` | List uploaded grounding documents |
| `POST /api/interviews/:id/documents` | Upload a grounding document |
| `POST /api/interviews/:id/spec` | Write the interview spec artifact |
| `GET /api/interviews/:id/generation-spec` | The generated spec |
| `GET /api/interviews/:id/okf` | The spec rendered as an [OKF](okf.html) bundle (path → Markdown map) |

---

## Client (`geClient.ts`)

The `ge` export wraps every endpoint. Representative mappings:

| Client method | Endpoint |
|---|---|
| `ge.status()` / `ge.fleet()` / `ge.doctor(scope, command)` | `GET /api/ge/status` / `/fleet` / `/doctor` |
| `ge.journey(body)` / `ge.mission(body)` | `GET /api/ge/journey` / `/mission` |
| `ge.ledgerRuns(limit)` / `ge.ledgerRun(id)` | `GET /api/ge/ledger/runs` / `/:id` |
| `ge.build(body)` / `ge.ship(body)` / `ge.sync(body)` | `POST /api/ge/agents/build` / `/ship` / `/sync` |
| `ge.up()` / `ge.dataUp()` / `ge.mcpDeploy()` | `POST /api/ge/up` / `/data/up` / `/mcp/deploy` |
| `ge.runtimeStart(body)` / `ge.runtimeResume(id)` | `POST /api/runtime/tasks` / `/:id/resume` |
| `ge.systems()` / `ge.synthesizeSystem(body)` | `GET /api/systems` / `POST /api/systems/synthesize` |

### Streaming (SSE) functions

| Function | Endpoint |
|---|---|
| `streamLedgerRun(runId, onEvent)` | `GET /api/ge/ledger/runs/:id/events` — the Run Drawer "Now" pulse |
| `streamLogs(runId, stage, onEvent, item?, onStatus?)` | `GET /api/ge/runs/:runId/logs` |
| `streamEvents(runId, onEvent)` | `GET /api/ge/runs/:runId/events` |
| `streamJob(jobId, onEvent, onStatus?)` | `GET /api/ge/jobs/:id/logs` |
| `streamDoctor(scope, command, onEvent)` | `GET /api/ge/doctor/stream` |
| `streamRuntimeEvents(taskId, onEvent)` | `GET /api/runtime/tasks/:id/events` |

These use `EventSource`; when auth is enabled the Firebase token is appended to the
URL (EventSource cannot set headers). The Run Drawer subscribes via the
`useRunStream` hook, which calls `streamLedgerRun` and de-dups on the event `seq`
— see the [Run Drawer + Now pulse flow](console-tour.html#run-drawer--now-pulse)
for the sequence.
