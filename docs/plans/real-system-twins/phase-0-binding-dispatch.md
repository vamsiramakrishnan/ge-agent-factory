# Phase 0 — Make bindings real: dispatch seam + connector core

> **Status (2026-07-17): safety-reviewed implementation.** Deliverables landed with
> two design notes discovered in flight: (1) the Python engine is
> deliberately zero-dependency, so live forwarding uses stdlib `urllib`
> inside `simulator_runtime/live_dispatch.py`, driven by a dispatch
> *directive* (`ge.dispatch-directive.v1`, env `GE_SIMULATOR_DISPATCH` /
> `GE_SIMULATOR_DISPATCH_FILE`) that `ge systems dispatch` compiles from the
> bindings store — the JS layer resolves policy, Python receives decisions;
> (2) deploy-time directive injection for the cloud tool plane is deferred
> to Phase 2's Secret Manager work (`deployEnvVars` joins with commas, which
> an inline JSON value would break — the cloud path needs the file/secret
> delivery form, not a bigger escape hatch). Live forwarding additionally
> requires an explicit pack binding `{op, collection}` — convention-bound
> legacy tools stay on the twin rather than URL-guessing. Live routing also
> requires process-level approval, uses HTTPS/public targets by default,
> bounds response bytes, and never persists raw live envelopes to cassettes.

## Goal

Convert system bindings from stored metadata into behavior. After this
phase, binding a system with `--kind rest --mode live_first` actually
changes where a tool call goes; `twin_only` and unbound systems behave
byte-identically to today.

## Why this is first

Every later phase needs a place where "call the real system" is a
resolved, policy-checked decision rather than an ad-hoc HTTP client:

- Phase 2's `profile` / `record` / `compare` dial live systems read-only.
- Mutation shadowing (Phase 1's runtime half) needs a boundary where a
  write is intercepted and simulated instead of forwarded.
- The connector SDK (deferred) needs an interface with a real consumer.

Today `ge systems bind` validates and persists
`.ge/systems/bindings.json` (`packages/byo-systems/src/bindings.mjs`,
schema `ge.system-binding.v1`, kinds `twin|mcp|rest`, modes
`twin_first|live_first|twin_only`) and `ge systems doctor` shape-checks
it — but no code anywhere reads a binding's `mode` to route a call, and
`--connector` is documented in the CLI itself as "informational until a
connector SDK exists" (`tools/ge/systems.mjs:130`).

## Deliverables

### 1. `calls-live-readonly` risk level

- Add to the risk vocabulary in `@ge/contracts` (`RiskLevelSchema`) and
  `@ge/core-api` (`RISK_LEVELS`), and thread through
  `assertCapabilityTable` in
  `packages/capability-registry/src/registry.mjs`.
- Semantics: the command may open network connections to an operator-
  configured external system and issue **only** requests classified
  read-only by that system's profile/binding. It never mutates the
  external system and never writes the repo.
- Console permission UX and MCP tool descriptions render this level
  distinctly (it is neither `read-only` nor `starts-workloads`).

### 2. Dispatch resolution in `@ge/byo-systems`

New module `packages/byo-systems/src/dispatch.mjs`:

```js
// resolveDispatch(system, { bindingsDir }) -> {
//   system, decision: "twin" | "live",
//   binding: <the stored binding or null>,
//   reason: "unbound" | "twin_only" | "twin_first" | "live_first"
// }
```

Rules (pure function over the stored binding, unit-testable without IO
via an injected reader):

- No binding → `twin`, reason `unbound` (today's documented posture:
  "twin-only until bound", `tools/ge/systems.mjs:168`).
- `twin_only` → `twin`.
- `twin_first` → `twin`, but the decision object carries the live
  binding so a caller running a realism comparison (Phase 2) can reach
  the live side deliberately.
- `live_first` → `live` when the binding kind is dialable (`rest` in
  this phase; `mcp` deferred), else `twin` with a doctor-visible warning.

### 3. Connector core (minimal, REST-only)

New package `packages/connector-core` — the smallest interface that has
a real consumer, not the full SDK from the design review:

```js
// createRestConnector({ baseUrl, authRef, timeoutMs }) -> {
//   probe(op)      // read-only reachability + status, never a body write
//   call(op, args) // forward a tool op; refuses non-GET unless the
//                  // caller passes an explicit sandbox/dry-run token
// }
```

- `authRef` is an `env:VAR` reference resolved at call time; the token
  is never persisted, logged, or included in errors.
- Refusal to forward mutations is structural: the connector checks the
  HTTP method class, not a flag the caller might forget.
- `connector` on a binding stops being purely informational: when set,
  it must name a module resolvable to this interface;
  `ge systems doctor` verifies resolvability (still without dialing).

### 4. One real consumer: the tool-plane router

Wire dispatch into the MCP tool plane that serves simulator systems
(`apps/factory/mcp-service`): before serving a tool call from the
simulator, resolve dispatch for the target system; on `live` for a
`rest` binding, forward via `connector-core` and translate the response
into the simulator envelope. Read-path ops only in this phase
(`search`, `get` from `_BINDING_OPS`, `generic.py:1052`); write ops
always route to the twin regardless of mode until Phase 1 lands
mutation semantics.

The Python side receives the *decision*, not the policy: the JS layer
resolves bindings and passes an explicit per-system dispatch directive
(env/config), keeping secrets and policy out of the Python runtime.

### 5. Registry, doctor, docs

- `ge systems doctor` gains `--dial` (risk `calls-live-readonly`): for
  each `rest` binding, one HEAD/GET reachability probe with the resolved
  auth ref; reports reachable/unauthorized/unreachable with `fix:`
  lines. Without `--dial`, behavior is unchanged (never dials).
- Registry entries updated for `systems.doctor` (new flag) — CLI
  reference regenerated (`bun run docs:cli`).
- `docs/reference/` binding docs updated: modes now have runtime
  meaning; document the write-ops-always-twin rule.

## Deliberately not in this phase

- No `mcp`-kind dialing (needs an MCP client story; the interface leaves
  room for it).
- No connector marketplace/publishing; `connector-core` is internal.
- No mutation forwarding of any kind, sandbox or otherwise.
- No changes to pack formats, synthesis, or evals.

## Tests and gates

- Unit: dispatch precedence table (every kind × mode × bound/unbound
  combination) in `packages/byo-systems`.
- Unit: connector refuses non-read methods; auth ref never appears in
  serialized errors (assert on the error JSON).
- Integration: a local run against a bound-but-`twin_only` system is
  byte-identical to an unbound run (golden comparison).
- Parity: `tools/mcp-registry-parity.test.mjs` green; registry
  `assertCapabilityTable` accepts the new risk level.
- Standing gates: `bun run source:hygiene`, `bun run test:gated`.

## Acceptance criteria

- [x] `resolveDispatch` exists, is pure, and covers the full precedence
      table with tests (`packages/byo-systems/src/dispatch.mjs` + tests).
- [x] Binding a local demo system `--kind rest --mode live_first` to a
      local stub server routes `search`/`get` tool calls to the stub;
      unbinding restores twin behavior with no other change (verified
      end-to-end through `execute_simulator_tool` and covered by
      `simulator_runtime/test_live_dispatch.py`).
- [x] Write-class tool calls route to the twin under every mode
      (router forwards only `READ_OPS`; test asserts the stub sees no
      write request).
- [x] `ge systems doctor --dial` reports reachability with `fix:` lines
      and is the only code path that dials without an explicit
      binding-routed call (`tools/lib/systems-dial.mjs`).
- [x] `calls-live-readonly` renders distinctly in console and MCP
      surfaces (new risk vocabulary entry in `@ge/core-api` +
      `@ge/contracts`; `systems.dial` is its first registry consumer).
- [x] No secret value appears in any artifact, log line, or error
      (asserted in `connector-core` and `live_dispatch` tests; auth
      travels as env-var names end to end).

## Risks

- **Envelope mismatch.** Real REST responses will not match simulator
  envelopes field-for-field; the translation layer must be honest about
  gaps (mark fields absent) rather than fabricating. Scope creep guard:
  translation quality is Phase 2's realism problem, not Phase 0's.
- **Auth diversity.** v1 supports bearer-token-from-env only. OAuth
  flows, mTLS, and signed requests are explicitly out; the binding
  `config` object is the extension point.
