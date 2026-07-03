# Example session — expose an existing `ge` command as a console action

A worked interaction showing the registry-first workflow: check the shared
command registry → confirm the CLI surface → one registry entry + client
method + sentinel test → validate. CLI help and test outputs are real (run
in this repo); the code snippets show the shape, not a paste-ready diff.
Read this when asked to "add a button/route/action" to the console and
you're deciding where the logic belongs.

## The ask

> Operator: "The Runs view should have a 'Backfill ledger' action so old
> `.ge-state.json` runs show up in the timeline. Add it to the console."

## Step 1 — registry first, never a bespoke route

The console, CLI, and MCP server share one command registry
(`tools/lib/ge-command-registry.mjs`). Before writing any route logic,
check whether the command is already registered:

```console
$ grep -n '"ledger' tools/lib/ge-command-registry.mjs
(no output — not registered yet)
```

Not there → the work is a **registry entry**, not bespoke `ge-api.mjs`
logic. If it had been there, the job route would already exist via
`commandForRoute` and only the UI/client would need wiring.

## Step 2 — confirm the CLI surface being wrapped

```console
$ bun tools/ge.mjs ledger backfill --help
Import legacy run state (.ge-state.json + factory-run-*.json) into the durable ledger (ledger backfill)

USAGE ledger backfill [OPTIONS]

OPTIONS
  --json    Machine-readable JSON result on stdout
  …
```

The registry entry's `argv()` must produce exactly this invocation — never
invent flags the CLI doesn't have.

## Step 3 — one registry entry (route/CLI/risk triple)

Added to `tools/lib/ge-command-registry.mjs` (shape mirrors the
`daemon.start` entry — the canonical recent example):

```js
"ledger.backfill": {
  id: "ledger.backfill",
  method: "POST",
  path: "/api/ge/ledger/backfill",
  cli: "ge ledger backfill",
  label: "Backfill ledger",
  summary: "Import legacy run state into the durable ledger",
  risk: "writes-repo",              // must exist in @ge/contracts RiskLevelSchema —
  expectedDuration: "under 30s",    // tools/contracts-registry-parity.test.mjs enforces it
  requirements: { bins: ["node"], config: [] },
  argv: () => ["ledger", "backfill"],
},
```

Decisions made here:

- `risk` is honest: it writes local ledger files, no cloud mutation. A new
  risk value would require extending the contracts enum first (the parity
  test fails otherwise).
- No handler code: the catch-all `commandForRoute` row in
  `apps/console/src/server/ge-api.mjs` returns a **job sentinel**
  (`{ job: argv, command, cfg }`); `transport.mjs` spawns and streams it.
  `ge-api.mjs` routes and returns sentinels — it never executes.

## Step 4 — client method + sentinel test

- `apps/console/src/services/geClient.ts`: one typed method POSTing
  `/api/ge/ledger/backfill`.
- `apps/console/src/server/ge-api.test.mjs`: a route-sentinel test asserting
  the POST resolves through `commandForRoute` to
  `["ledger", "backfill"]` — same shape as the existing
  "POST data/up starts the ge data up job" test.
- UI: the Runs view calls the client method and shows the persisted job —
  no factory logic in React.

## Step 5 — validate (real output, this repo)

```console
$ bun test apps/console/src/server/ge-api.test.mjs
 41 pass
 0 fail
 268 expect() calls
Ran 41 tests across 1 file. [361.00ms]
$ node --check apps/console/src/server/ge-api.mjs && node --check apps/console/src/server/transport.mjs
(no output — both parse)
```

(Your run should show one more passing test — the new sentinel.)

## Step 6 — report back

> Agent: "Backfill is a console action now: one registry entry
> (`ledger.backfill`, risk `writes-repo`), job route free via
> `commandForRoute`, typed `geClient` method, sentinel test green. No new
> route logic in `ge-api.mjs`; execution/persistence stays in
> `transport.mjs`. Read-only surfaces unchanged."

## Failure variant — the surface audit reports missing operators

```console
$ node skills/operating-console/scripts/audit-console-surface.mjs
{
  "ok": false,
  "results": [
    { "path": "apps/console/src/server/ge-api.mjs",
      "ok": false,
      "missing": ["/api/ge/mission", "autopilotStart"] },
    { "path": "apps/console/src/server/transport.mjs",
      "ok": false,
      "missing": ["startAutopilotRun", "resumeAutopilotRun", "missionPlan"] },
    …
  ]
}
```

React: each `missing` entry is a wired surface the audit expects in that
file. If your change renamed or moved it, restore the wiring (or route it
through the layer that now owns it) — don't edit the audit's expectations
to make it green unless the surface was deliberately retired, and say so in
the run record. A failure that predates your change is not yours to fix
silently: report it, don't absorb it.
