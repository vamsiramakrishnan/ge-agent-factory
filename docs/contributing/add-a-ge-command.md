---
title: Add a ge command
description: Add an existing ge operation to the shared capability registry so CLI, console, HTTP, and MCP surfaces stay structurally aligned.
parent: Contributing
nav_order: 10
layout: default
---

# Add a `ge` command to the shared registry

**Scope:** repo change — code + tests only; nothing runs in the cloud.

## Goal

Wire an existing `ge` CLI command into the shared command registry
(`packages/capability-registry/src/registry.mjs`) so the console gets a `/api/ge/*` route,
preflight gating, risk labeling, and live job streaming for it — without
writing any bespoke route or process-spawning logic.

Worked example throughout: **`daemon.start`**, the entry that backs the
console's one-click "Start daemon" button — and the precedent AGENTS.md
points to.

## Prerequisites

- The underlying `ge` subcommand **already exists and works** in
  `tools/ge.mjs` / `tools/ge/*.mjs`. The registry maps metadata to a `ge`
  argv — it does not implement behavior. If the command itself is new, build
  it first under `tools/ge/` (handlers return data / throw errors; the
  `emit()` boundary in `tools/ge/shared.mjs` renders JSON for non-TTY callers
  — see AGENTS.md's "return/throw, don't print/exit" convention). For
  `daemon.start` that is `daemonStart` in `tools/ge/daemon.mjs`.
- Read the **capability contract in `@ge/core-api`
  (`packages/core-api/src/capability.mjs`)** — it is the source of truth for
  the `risk` vocabulary, every `requirements` key, and the
  `observability.mode` vocabulary, and the registry validates every entry
  against it at import time (a malformed entry fails every surface at load).

> Before adding a new `/api/*` route for a console action, check whether the
> underlying `ge`/`factory` command already exists and needs only a registry
> entry. Bespoke route logic in the console server is the exception
> (repair runs, interviews, systems), not the rule.
{: .important }

## How an entry flows through the system

<p align="center">
  <img src="../assets/diagrams/ge-command-flow.svg" alt="One registry entry backs both the ge CLI and a console route; a matched route runs preflight from the entry's requirements — a failure persists a blocked job with the failing checks, a pass submits the argv to the daemon (falling back to a local spawn if the daemon is unreachable), and events stream to the browser over SSE, labeled with the entry's risk" width="520">
</p>

One registry entry is consumed at five places. All paths are real and current:

1. **Registry** — `packages/capability-registry/src/registry.mjs` defines
   `GE_COMMANDS["<id>"]` with `{ method, path, cli, label, summary, risk,
   expectedDuration, requirements, observability, argv(body) }`, and exposes
   `commandForRoute` / `commandMeta` / `commandRequirements` /
   `GE_COMMAND_LIST`. The console imports these through the re-export shim
   `apps/console/src/shared/ge-commands.mjs`.
2. **Console route dispatch** — `apps/console/src/server/ge-api.mjs`. Its
   POST fall-through calls `commandForRoute(req.method, parts)`; a match
   returns a **job sentinel** `{ job: command.argv(body), command: meta, cfg,
   selection }` (no route code per command — `isKnownRoute` also defers to
   `commandForRoute`). The transport-agnostic router
   `apps/console/src/server/ge-api-router.mjs` (`dispatchGeApiResult`) turns
   that sentinel into `startGeJob(...)` and replies `202 { jobId, command }`.
3. **Job runner** — `startGeJob` in `apps/console/src/server/transport.mjs`:
   - runs **preflight**: `core.preflightCommand(cfg, { commandId, selection })`
     → `commandDoctor` in `tools/lib/doctor.mjs`, which reads
     `commandRequirements(id)` and turns each `requirements` key into concrete
     checks (`bins` → PATH probes, `config` → `.ge.json` keys, `cloudAuth` →
     `gcloud auth list`, `toolPlane` → per-department MCP checks, and so on).
     A failing preflight persists a **blocked** job (with the check list) and
     never spawns anything.
   - on pass, submits the argv to the local runtime daemon
     (`POST http://127.0.0.1:$GE_DAEMON_PORT/api/tasks` with
     `{ kind: "ge.command", argv, command }`). The daemon's run-kind handler
     `startGeCommandTask` in `tools/lib/daemon/command-run.mjs` spawns
     `node tools/ge.mjs <argv>` via `execStream` and appends events to its
     durable run store.
   - if the daemon is unreachable, it **falls back to a local spawn** of
     `bun tools/ge.mjs <argv>` in-process, with a visible
     "Daemon unavailable; running this job locally" event.
4. **Where output lands** — every spawned command emits
   `stage_started` / `log` / `stage_done|stage_failed|stage_blocked` events.
   They are persisted per job (console `job-store.mjs`, daemon run store) and
   streamed to the browser over SSE via `GET /api/ge/jobs/:id/logs`
   (`streamJob` in `transport.mjs`); the console's `JobToast` renders them,
   labeled with the entry's `risk`. `ge runs events <run-id> --follow`
   shows the same stream from the CLI.
5. **Console client + doctor** — `GET /api/ge/commands` returns
   `GE_COMMAND_LIST`, typed as `GeCommand` in
   `apps/console/src/services/geClient.ts` (its `risk` union comes from
   `@ge/contracts`, which the parity test holds equal to `@ge/core-api`'s
   `RISK_LEVELS`). The same
   `requirements` also power on-demand readiness:
   `ge doctor --command <id>` and `/api/ge/doctor?command=<id>` both route to
   `commandDoctor`.

> The MCP server (`tools/mcp-server.mjs`) reads this registry too: it derives
> its tool surface (names, descriptions, param schemas) from each entry's
> `mcp` block — never hand-write a tool there. If your command should also be
> model-callable, add an `mcp` block to the entry and an in-process handler
> (keyed by registry id, calling the same core function) to `HANDLERS` in
> `tools/mcp-server.mjs`; `tools/mcp-registry-parity.test.mjs` fails if the
> declared blocks and the handler map drift apart.
{: .note }

## Steps

1. **Add the registry entry.** The real `daemon.start` entry in
   `packages/capability-registry/src/registry.mjs`:

   ```js
   "daemon.start": {
     id: "daemon.start",
     method: "POST",
     path: "/api/ge/daemon/start",
     cli: "ge daemon start",
     label: "Start local daemon",
     summary: "Start the local GE runtime daemon (idempotent — no-op if already running)",
     risk: "starts-local-workloads",
     expectedDuration: "under 10s",
     observability: {
       mode: "command-output",
       events: false,
     },
     requirements: {
       bins: ["node"],
       config: [],
     },
     argv: () => ["daemon", "start"],
   },
   ```

   - `risk` is one of `mutates-cloud` · `starts-workloads` (cloud) ·
     `starts-local-workloads` · `writes-repo` · `read-only` — pick per
     `@ge/core-api`'s `RISK_LEVELS`; a new value also means extending
     `RiskLevelSchema` in `@ge/contracts` (the zod twin the console types
     `GeCommand.risk` from — `tools/contracts-registry-parity.test.mjs` holds
     the two vocabularies equal).
   - `requirements` keys become the preflight checks listed above — declare
     only what the command truly needs (over-declaring blocks users
     spuriously; `daemon.start` needs nothing but `node`).
   - `observability.mode` is `command-output` (raw stdout) unless the command
     emits structured events (`remote-stage-logs`, `local-factory-events`,
     `runtime-events` — see `agents.build`, `agents.build.local`,
     `pipeline.run` for each shape). Omitting `observability` defaults to
     `{ mode: "command-output", events: false }`.
   - `argv(body)` maps the POST body to real CLI flags — see `agents.build`
     for a body-mapping example. CLI-only commands set
     `method: null, path: null` (see `pipeline.run`) and are skipped by
     `commandForRoute`.

2. **No console route code.** `commandForRoute` picks the new `method` +
   `path` up automatically in both `isKnownRoute` and the POST fall-through of
   `apps/console/src/server/ge-api.mjs`. The one special case to know about:
   `agents.build` is swapped to `agents.build.local` there when
   `body.local === true` or the operator is in local mode — only add logic
   like that if two entries genuinely share one route.

3. **Add a client method and call it from the UI.** In
   `apps/console/src/services/geClient.ts`:

   ```ts
   daemonStart: () => post("/api/ge/daemon/start", {}),
   ```

   and in the component (see
   `apps/console/src/components/RuntimeStatusBadge.tsx`):

   ```ts
   await startJob("ge daemon start", ge.daemonStart());
   ```

   `startJob` hands the returned `jobId` to the shared job toast, which
   subscribes to `/api/ge/jobs/:id/logs`.

4. **Tests.** The contract tests in
   `packages/capability-registry/src/registry.test.mjs` (plus the
   surface-parity suite beside it) iterate **every** entry (requirements present, observability shaped,
   `argv({})` returns a concrete string array) — a malformed entry fails
   without you writing anything. Add targeted tests there when your `argv`
   does body mapping, and a route test in
   `apps/console/src/server/ge-api.test.mjs` (drive `handleGeApi` with
   `{ method: "POST", path: "<your path>", body }` and assert the sentinel).

## Verify

```bash
# the CLI command itself
ge daemon start

# registry + route contracts
bun test packages/capability-registry/src apps/console/src/server/ge-api.test.mjs

# end-to-end through the console server (mise run console, default port 18260)
curl -s -X POST http://localhost:18260/api/ge/daemon/start | head -5   # → { "jobId": ..., "command": { "id": "daemon.start", ... } }
curl -s http://localhost:18260/api/ge/commands | grep daemon.start     # entry visible to the UI

# readiness derived from your requirements block
ge doctor --command daemon.start
```

Then the repo gate (`node tools/source-hygiene.mjs && node
tools/check-no-app-imports.mjs && node
apps/factory/scripts/gen-harness-schemas.mjs --check && node
tools/check-design-tokens.mjs`) and `bun run test:gated`.

## Troubleshoot

- **404 from the console route** — `commandForRoute` matches `method` *and*
  `path` exactly (`/${parts.join("/")}` of the URL). Check the `path` field
  matches your POST URL byte-for-byte, including the `/api/ge/` prefix.
- **Job immediately `blocked`** — preflight failed; the job's first events
  carry the failing checks. `ge doctor --command <id>` reproduces them.
  Usually an over-declared `requirements` key.
- **403 `console is read-only`** — `GE_CONSOLE_READONLY` gates every POST in
  `ge-api.mjs` before dispatch; expected in hosted read-only deploys.
- **Command runs but the UI shows no live output** — the daemon path streams
  events from the daemon's run store; if the daemon is down the job falls
  back to a local spawn (look for the "Daemon unavailable" warning event).
  `ge daemon status` / `ge runs list` to inspect.
- **TypeScript error on `risk`** — you introduced a new risk value; extend
  `RISK_LEVELS` in `@ge/core-api` **and** `RiskLevelSchema` in `@ge/contracts`
  in the same change (the parity test holds them equal, and the console types
  `GeCommand.risk` from the contracts enum).

## See also

- `skills/operating-console/references/api-transport-contract.md` — the
  console's layer rules (`geClient.ts → ge-api.mjs → transport.mjs →
  factory-core.mjs`) and the condensed mutating-command pattern this page
  builds on.
- [Console & APIs](../reference/console-and-apis.html) — the full route
  surface.
- [CLI reference](../reference/cli.html) — the `ge` command tree.
