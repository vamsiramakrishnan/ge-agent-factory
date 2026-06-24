# GE Agent Factory Console — Design

**Date:** 2026-06-02
**Status:** Approved (direction); spec for review → implementation plan to follow.
**Related:** the `ge` CLI DX (`tools/ge.mjs`, `tools/lib/factory-core.mjs`), the data/tool planes, and the deck (`apps/presentation`).

## Goal

A web **ops console** that manages the full factory lifecycle elegantly — the visual twin of
the `ge` CLI — runnable locally (dev server on an authed machine) and remotely (deployed). It
replaces the deck's bolted-on per-slide provisioning with a first-class console.

## Approved decisions

| Decision | Choice |
|---|---|
| App structure | **New `apps/console`** (dedicated ops UI), separate from `apps/presentation` (deck). |
| Backend | **`factory-core` over HTTP** — gateway/server exposes `/api/ge/*` returning the same JSON the CLI emits. "One core, three surfaces" (CLI · MCP · Console). |
| Home view | **Overview / status board** (mirrors bare `ge`). |

## Architecture

```
apps/console/
  src/            React 19 + Vite + Tailwind v4 (reuse presentation's design tokens/stack)
  server.js       Bun HTTP server: serves the SPA + /api/ge/* backed by factory-core
  vite.config.ts  dev proxy /api → server
```

**One core, three surfaces.** `server.js` imports `../../tools/lib/factory-core.mjs` and maps
operations to endpoints. The web client (`src/services/geClient.ts`) is a thin typed fetch layer —
the visual analogue of `tools/ge.mjs`.

### `/api/ge/*` contract (returns the CLI's JSON verbatim)

Reads (cheap `gcloud describe` / config):
- `GET /api/ge/status` → `statusBoard(cfg)` (mode, project/app, planes, next)
- `GET /api/ge/doctor?scope=all|local|cloud|data|mcp` → `doctorAll(cfg, opts)`
- `GET /api/ge/fleet` → fleet roster + per-agent status (catalog × `.ge-state.json` × run snapshots)
- `GET /api/ge/agents/:id` → one agent's stages/artifacts/run
- `GET /api/ge/logs/:runId?stage=…` → `logs(cfg, …)` (final stage result; superseded live by the stream below)
- `GET /api/ge/runs/:runId/events` → SSE passthrough of stage transitions (already on the gateway)
- `GET /api/ge/runs/:runId/logs?stage=…&follow=1` → **SSE line stream** (NDJSON events; see Observability)
- `GET /api/ge/artifacts/:runId/:item/:name` → fetch/preview a stage artifact (GCS remote / fs local)

Actions (mutating; see execution context below):
- `POST /api/ge/mode` `{mode}` → `setMode`
- `POST /api/ge/up` `{planes}` → `up` (infra/data/mcp)
- `POST /api/ge/mcp/deploy` → `mcpDeploy`
- `POST /api/ge/agents/build` `{scope|ids|dept, local}` → `provision`/`provisionLocal`
- `POST /api/ge/agents/ship` `{ids,startStage,targetStage}` → `ship`
- `POST /api/ge/agents/sync` `{push}` → `sync`/`syncLocal`

**Execution context.** Reads are safe anywhere the server has GCP read auth. Agent actions
(`build`/`ship`) submit to the existing factory gateway via `factory-core` (Cloud Tasks/Cloud Build
do the heavy work). **Infra mutations** (`up` = terraform, `mcp deploy` = `gcloud run deploy`) run
where the server runs — full power from the **local dev server on an authed machine**; in a deployed
console they are surfaced read-only / behind an explicit confirm and may be disabled by
`GE_CONSOLE_READONLY=1`. The spec assumes the primary console host is the local dev server (matches
the local/remote modes we built); a deployed read-mostly console is a follow-on.

## Views (UI/UX)

Visual language: the existing Google-Cloud-Console tokens (white surfaces, blue primary, semantic
state). Shell: left nav (Overview · Fleet · Planes · Doctor · Activity), top bar with **mode toggle
(Local/Remote)**, project/app, and a ⌘K command palette.

### 1. Overview (home — status board)
- Mode toggle + project/app header.
- Three **plane cards** (factory · data · tool): ✓/○ status, key detail, inline *Stand up* / *Doctor*.
- **Fleet progress** bar (X/363 deployed) + by-stage breakdown.
- **Next step** CTA (from `statusBoard.next`).
- **Activity** strip (latest live run events).

### 2. Fleet
- Searchable, filterable table of all 363 (department · status · stage · mode).
- Row → agent detail. Multi-select + bulk actions: **Build** (canary/all/dept), **Ship**, **Sync**.
- Status pills; per-row mini stage indicator.

### 3. Agent detail
- Stage **pipeline** (reuse/upgrade `FactoryProvisionPanel` from the deck).
- Live **logs** (`/api/ge/logs`), artifacts, and the **tool plane** the agent uses (1P MCP + custom MCP).
- Actions: build · ship · re-deploy · register · publish (mode-aware).

### 4. Planes / Stand-up
- factory/data/tool cards with *Stand up* (`up --plane`) + *Doctor* actions.
- A visual of the stage graph with the **build boundary** marked (local vs remote split).

### 5. Doctor
- The unified report grouped by section (toolchain · factory · data · tool plane), each check with
  status + the **fix** command; a "copy fix" affordance. Re-run button; scope filter.

### 6. Activity
- Live feed of run/stage transitions via SSE; filter by agent/stage; links to agent detail.
- Opening a run shows the live `<LogStream>` + artifact browser (see Observability).

## Observability (Tier 1 — the keystone)

Today logs are stage *transitions* (Firestore-driven SSE) + the *final* captured stderr per stage
(`ge logs` reads `factory-<stage>-result.json` after the stage ends). Tier 1 makes logs live,
structured, searchable, and identical across modes.

**Unified event/log bus — one NDJSON schema, two producers:**

```json
{ "runId": "...", "agentId": "...", "stage": "validate", "ts": "...",
  "type": "log|stage_started|stage_done|stage_failed|artifact|metric",
  "level": "info|warn|error", "line": "...", "data": {} }
```

- **Remote producer:** the worker (`factory-worker.js`) currently buffers each command's
  stdout/stderr and uploads it at stage end. Change to **tee line-by-line** into an append target —
  `gs://<bucket>/runs/<runId>/items/<itemId>/<stage>.ndjson` (incremental). The gateway exposes
  `/api/ge/runs/:id/logs` that **tails new lines** over SSE (poll the object's growing length, or
  Cloud Logging structured entries labelled run/agent/stage).
- **Local producer:** the harness writes the **same NDJSON** to `.harness/runs/<runId>/<stage>.ndjson`
  + a run index; the console `server.js` **file-watches** these and serves `/api/ge/runs` + the same
  SSE line stream — so local in-flight builds stream into the console exactly like remote. (Local is
  a one-shot CLI today; the run journal is the new mechanism that makes local observable.)

**Subprocess streaming (agents-cli · gcloud · Antigravity SDK) — required for live logs to actually work.**
These tools are Python and **block-buffer stdout when it isn't a TTY**, so piping naïvely yields one
late dump. Today `factory-core.run` is `execFileSync` (fully buffered); the worker's `runCommand`
either `inherit`s to the container console (not teed to our bus) or buffers to stage-end; only the
harness-runner already chunk-streams. Tier 1 introduces **one streaming exec helper** used by the
worker, the harness, and factory-core:

- **Spawn piped + line-split** stdout/stderr; emit each line as an NDJSON `log` event (with
  `stream: stdout|stderr`, inferred `level`) to the live sink **immediately**, while still
  accumulating the full buffer for the final stage result (keeps `ge logs` working).
- **Env normalization** so the Python tools stream: `PYTHONUNBUFFERED=1`, `PYTHONIOENCODING=utf-8`,
  `CLOUDSDK_CORE_DISABLE_PROMPTS=1` (gcloud non-interactive); keep ANSI (rendered by `<LogStream>`).
- **Per-tool flags:** gcloud `--verbosity=info` for useful progress, and tee Cloud Build output via
  `gcloud builds log <id> --stream` (the worker already polls build status); `agents-cli` runs
  non-interactive (collapse its rich `\r` spinner updates); Antigravity inherits `PYTHONUNBUFFERED`
  so the SDK's python-logging streams (the harness already reads its chunks → just route to the bus).
- **`\r` / ANSI handling:** the line-splitter treats carriage-return progress as last-line updates;
  `<LogStream>` renders ANSI color.
- **Structured extraction:** JSON-bearing output (gcloud `--format=json`, `agents-cli` eval results,
  Cloud Build id, `reasoningEngine` id) is parsed into `artifact`/`metric`/`data` events — not just
  raw lines — so the console can show scores and deep-link resources.

**Console rendering — the brilliant part:**
- `<LogStream>`: ANSI-colored, line-numbered, **virtualized** (100k+ lines), follow-tail,
  search/filter by level·stage·agent, per-stage collapsible sections, copy/permalink a line.
- **Artifact browser** beside the stream: open `validation-report.json`, `preview-report.json`,
  eval results, `deployment_metadata.json`, the workspace tarball (via `/api/ge/artifacts/...`).
- **Global log search** across the fleet (Cloud Logging query remote / journal grep local).

This is the non-negotiable core. **Deferred (Tier 2/3):** inline Cloud Build/Run/Agent-Runtime log
tails + run control (retry/cancel/re-run-from-stage); eval/quality panel + Cloud Trace runtime
telemetry + provenance/diff. Designed for, built later.

## Key components
- `ModeToggle`, `PlaneCard`, `StatusPill`, `StagePipeline`, `FleetTable`, `DoctorReport`,
  `ActivityStream`, `LogStream`, `ArtifactBrowser`, `CommandPalette`, `ActionToast`. `motion` for
  transitions; `lucide-react` icons.
- `geClient.ts` — typed wrappers over `/api/ge/*`; React Query-style hooks (or a small SWR-ish
  fetcher) with polling for status/fleet and SSE for activity.

## Local vs remote (clarifying the user's "locally/remotely")
- **Local:** `bun run dev` (vite) + `server.js` on your authed machine — full lifecycle incl. infra.
- **Remote:** the console deployed (its own Cloud Run service `ge-agent-factory-console`, or served
  by the gateway) — read-mostly + agent actions delegated to the gateway; infra mutations gated.
The console's **mode toggle** (local/remote factory ops) is orthogonal to where the console is hosted.

## Reuse vs new
- Reuse from `apps/presentation`: `design-tokens.ts`, Tailwind setup, `FactoryProvisionPanel`,
  `factoryClient.ts` types, the SSE event shape, the Cloud-Console aesthetic.
- New: the console shell + the six views + `geClient.ts` + the `/api/ge/*` server layer.

## Non-goals
- Editing agent code in the browser (sync to repo handles code).
- Replacing the deck (kept for demos).
- Auth/RBAC for a multi-tenant hosted console (single-operator assumption; IAP fronts it like the gateway).

## Verification
- `apps/console` builds (`vite build`) and dev-runs (`bun run dev`) in the sandbox.
- `/api/ge/status` and `/api/ge/doctor` return the same shape as `ge ... --json` (contract test).
- Overview renders planes + fleet from the API; Fleet table filters; Doctor shows fixes; Activity
  streams SSE. Type-check (`tsc --noEmit`) clean.
