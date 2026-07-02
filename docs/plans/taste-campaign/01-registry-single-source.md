# WS1 — Make the command registry the single source for MCP and console routing

**Status:** `[ ]` open
**Write-set:** `tools/lib/ge-command-registry.mjs` · `tools/mcp-server.mjs` ·
`apps/console/src/server/ge-api.mjs` + `apps/console/src/server/ge-api.test.mjs` ·
`apps/console/src/services/geClient.ts` (risk union line only) ·
NEW `tools/mcp-registry-parity.test.mjs` · NEW `tools/check-app-import-surface.mjs` ·
`package.json` (`source:hygiene` script line only)
**Depends on:** nothing. **Blocks:** WS4, WS5-A.

## Problem (verified 2026-07-02)

- `tools/mcp-server.mjs` hand-writes 10 tools (`server.tool("factory_provision", …)`)
  with zero imports from `tools/lib/ge-command-registry.mjs`. Tool names drift
  from registry ids (`factory_provision` vs `agents.build`); registry `risk`,
  `requirements`, `summary` metadata is unused by MCP.
- `apps/console/src/server/ge-api.mjs` encodes its route surface **twice**: the
  dispatch if-chain in `handleGeApi` and the parallel list in `isKnownRoute()`
  (lines ~328–358). Two hand-synced lists.
- The registry (`GE_COMMANDS`, 9 entries) covers only mutating commands; the
  read/observe surface (doctor, status, logs, list-usecases, mcp-doctor) has no
  registry identity at all.
- Nothing stops `apps/*` from importing arbitrary `tools/lib/*` internals by
  relative path (current importer inventory below).

## Target

One `GE_COMMANDS` table describes every operator command (mutating **and**
read-only). The MCP server registers its tools **from** the table. `ge-api.mjs`
has exactly one route table. A CI guard freezes which `tools/lib` files apps may
import.

---

## Step 1 — Extend the registry entry contract (`tools/lib/ge-command-registry.mjs`)

Add two things. Keep the file **dependency-free** (no zod import — the console
client re-exports this module).

**1a. New `risk` value** `"read-only"`. Update the field-contract comment and
add the value to the union in `apps/console/src/services/geClient.ts:297`:

```ts
risk: "mutates-cloud" | "starts-workloads" | "starts-local-workloads" | "writes-repo" | "read-only" | string;
```

**1b. New optional `mcp` field** on each entry, with this exact shape (document
it in the header comment alongside `risk`/`requirements`/`observability`):

```js
// - `mcp` (object, optional): presence means this command is exposed as an MCP
//   tool by tools/mcp-server.mjs (which derives name/description/schema from
//   here — never hand-write them there).
//   - `tool` (string) — MCP tool name, `factory_*` convention.
//   - `description` (string) — full tool description shown to models.
//   - `params` (object) — flat param descriptors, keyed by param name:
//     { type: "string"|"boolean"|"number", enum?: string[], optional?: true,
//       description?: string }
```

**1c. Add read-only entries** (method/path `null` — they are not console job
routes) so the whole MCP surface has registry identity. Add these five, with
`description`/`params` **moved verbatim** from the current
`tools/mcp-server.mjs` strings (do not rewrite prose):

| Registry id | `mcp.tool` | params (from current zod shapes) |
|---|---|---|
| `usecases.list` | `factory_list_usecases` | `department?`, `search?` (string), `limit?` (number) |
| `doctor` | `factory_doctor` | — |
| `status` | `factory_status` | `noProxy?` (boolean) |
| `logs` | `factory_logs` | `runId` (string, required), `stage?`, `item?` (string) |
| `mcp.doctor` | `factory_mcp_doctor` | — |

All five: `risk: "read-only"`, `label`/`summary` written fresh (one line),
`requirements: { bins: [], config: [] }` unless the current tool implies more.

**1d. Add `mcp` blocks to the existing mutating entries** that MCP already
exposes: `agents.build` → `factory_provision`, `agents.sync` → `factory_sync`,
`agents.ship` → `factory_ship`, `mcp.deploy` → `factory_mcp_deploy`. Param
descriptors transcribe the current zod shapes in `tools/mcp-server.mjs:38-58`
field-for-field (e.g. `scope: { type: "string", enum: ["canary","all"], optional: true }`).
Entries `up`, `data.up`, `daemon.start`, `agents.build.local`, `mission.run`
get **no** `mcp` block (not exposed today — do not widen the MCP surface in
this workstream).

## Step 2 — Rewrite `tools/mcp-server.mjs` as a registry consumer

Replace the ten `server.tool(...)` calls with:

```js
import { GE_COMMANDS } from "./lib/ge-command-registry.mjs";

// zod schema from the registry's dependency-free param descriptors.
function zodFromParams(params = {}) {
  const shape = {};
  for (const [name, p] of Object.entries(params)) {
    let s = p.enum ? z.enum(p.enum) : { string: z.string(), boolean: z.boolean(), number: z.number() }[p.type];
    if (!s) throw new Error(`unknown mcp param type '${p.type}' for '${name}'`);
    shape[name] = p.optional ? s.optional() : s;
  }
  return shape;
}

// In-process implementations, keyed by REGISTRY ID. Handlers stay here —
// they call core directly (not subprocesses) — but names/descriptions/schemas
// come from the registry. Bodies are the CURRENT handler bodies, moved verbatim.
const HANDLERS = {
  "usecases.list": (a) => core.listUsecases(a),
  "doctor":        () => core.doctor(cfg()),
  "status":        (a) => core.status(cfg(), { noProxy: a.noProxy }),
  "logs":          (a) => core.logs(cfg(), a),
  "agents.build":  (a) => a.local
    ? core.provisionLocal(cfg(), { scope: a.scope, ids: a.ids, dept: a.dept, limit: a.limit, target: a.target, vertex: a.vertex !== false })
    : core.provision(cfg(), a),
  "agents.sync":   (a) => a.local
    ? core.syncLocal(cfg(), { remote: a.remote, push: a.push, commit: a.commit !== false, create: a.create })
    : core.sync(cfg(), a),
  "agents.ship":   (a) => core.ship(cfg(), { ids: a.ids, startStage: a.startStage || "load_data", targetStage: a.targetStage || "publish_enterprise", noProxy: a.noProxy }),
  "mcp.deploy":    () => core.mcpDeploy(cfg()),
  "mcp.doctor":    () => core.mcpDoctor(cfg()),
};

for (const command of Object.values(GE_COMMANDS)) {
  if (!command.mcp) continue;
  const handler = HANDLERS[command.id];
  if (!handler) throw new Error(`registry entry '${command.id}' declares mcp but has no handler`);
  server.tool(command.mcp.tool, command.mcp.description, zodFromParams(command.mcp.params),
    async (a) => { try { return result(await handler(a)); } catch (e) { return fail(e); } });
}
```

`BEHAVIOR-PRESERVING check:` the registered tool set (names, descriptions,
param names/types/optionality, handler semantics) must be byte-identical to
before. `factory_provision`'s current zod includes `concurrency?`, `force?`,
`noProxy?`, `local?`, `vertex?`, `target?`, `limit?` — carry every one into the
descriptor; the parity test below will catch omissions only if written first,
so write it first.

## Step 3 — Parity test FIRST (`tools/mcp-registry-parity.test.mjs`)

Written and passing against the OLD server before Step 2 lands (capture the
old surface as a fixture), then kept as the permanent guard:

```js
import { test, expect } from "bun:test";
import { GE_COMMANDS } from "./lib/ge-command-registry.mjs";

const EXPECTED_TOOLS = {
  factory_list_usecases: ["department?", "search?", "limit?"],
  factory_doctor: [],
  factory_status: ["noProxy?"],
  factory_logs: ["runId", "stage?", "item?"],
  factory_provision: ["scope?", "dept?", "ids?", "concurrency?", "force?", "noProxy?", "local?", "vertex?", "target?", "limit?"],
  factory_sync: ["force?", "push?", "commit?", "local?", "remote?", "create?"],
  factory_ship: ["ids?", "startStage?", "targetStage?", "noProxy?"],
  factory_mcp_deploy: [],
  factory_mcp_doctor: [],
};

test("every registry mcp block matches the frozen tool surface", () => {
  const entries = Object.values(GE_COMMANDS).filter((c) => c.mcp);
  const byTool = Object.fromEntries(entries.map((c) => [c.mcp.tool,
    Object.entries(c.mcp.params || {}).map(([n, p]) => p.optional ? `${n}?` : n)]));
  expect(byTool).toEqual(EXPECTED_TOOLS);
});
test("mcp tool names are unique and factory_-prefixed", () => { /* … */ });
```

(Fill in the second test; also assert `description` is a non-empty string and
`risk` is one of the five known values for every entry.)

## Step 4 — One route table in `ge-api.mjs`

Replace the if-chain + `isKnownRoute` pair with a single declarative table.
Shape (place above `handleGeApi`):

```js
// The single route table. `match(parts)` returns a params object or null.
// Adding a route = adding one row; isKnownRoute derives from this table.
const ROUTES = [
  { method: "GET",  match: (p) => p[2] === "status" && !p[3] ? {} : null, handle: (ctx) => /* existing status block, moved verbatim */ },
  // … one row per existing branch, bodies MOVED not rewritten …
  { method: "POST", match: (p) => commandForRoute("POST", p) ? {} : null, handle: (ctx) => /* existing job-sentinel block */ },
];

function isKnownRoute(method, parts) {
  return ROUTES.some((r) => r.method === method && r.match(parts) !== null);
}
```

Rules: every current branch becomes exactly one row; handler bodies are moved,
not edited; the `agents.build`→`agents.build.local` mode-switch logic stays
inside the job row untouched. Extend
`apps/console/src/server/ge-api.test.mjs` (exists) with: (a) a table-driven
known/unknown route matrix asserting 404 parity with the current behavior,
(b) an assertion that every `GE_COMMANDS` entry with a non-null `path` is
matched by some row.

## Step 5 — Freeze the app→tools/lib import surface

New `tools/check-app-import-surface.mjs`, wired into `package.json`'s
`source:hygiene` chain (append `&& node tools/check-app-import-surface.mjs`).
Mechanics mirror `tools/check-no-app-imports.mjs` (read it first; same
scan/report style):

- Scan `apps/**/*.{mjs,js,ts,tsx}` (skip `node_modules`, `dist`, generated) for
  import specifiers matching `/tools\/lib\//`.
- Allowlist = the exact current importer→module pairs. Generate the initial
  list with:
  ```bash
  grep -rn "tools/lib/" apps --include='*.mjs' --include='*.js' --include='*.ts' -l | grep -v node_modules
  ```
  (Today: `apps/console/src/server/transport{,-oracle.test,.test}.mjs`, the
  `transport/` leaf modules, `apps/console/src/shared/ge-commands.mjs`,
  `apps/console/vite.config.ts`, and in `apps/factory/src`: `factory-worker.js`,
  `harness-journal.js`, `state-paths.js` (+test), `web-server.js`,
  `factory-worker-logtap.test.mjs` — re-derive at implementation time.)
- Failure message must say: "shrink-only allowlist — route new needs through
  `@ge/std` or a registry/transport seam, do not extend this list."

## Definition of done

- [ ] `bun test tools/mcp-registry-parity.test.mjs` green, and it was committed
      BEFORE the mcp-server rewrite (verify via `git log --follow`).
- [ ] `tools/mcp-server.mjs` contains zero hand-written tool names or
      descriptions (grep: `server.tool("` appears exactly once, in the loop).
- [ ] `grep -c 'if (parts\[2\]' apps/console/src/server/ge-api.mjs` returns 0;
      `isKnownRoute` derives from `ROUTES`.
- [ ] `bun test apps/console/src/server/ge-api.test.mjs` green with the new
      matrix cases.
- [ ] `node tools/check-app-import-surface.mjs` green and wired into
      `source:hygiene`.
- [ ] Full gate + `bun run test:gated` green.

## Forbidden

- Widening the MCP tool surface (no new tools for `up`/`data.up`/etc.).
- Rewriting tool descriptions "better" — verbatim moves only.
- Adding zod (or any dependency) to `ge-command-registry.mjs`.
- Touching `tools/lib` files other than the registry (that's WS4's ground).
