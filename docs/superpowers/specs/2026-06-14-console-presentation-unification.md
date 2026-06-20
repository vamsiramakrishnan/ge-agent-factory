# Console ↔ Presentation Unification — Foundational Design

> Status: **complete** (pending in-browser/daemon UX confirmation). Shipped: the `packages/`
> workspace (`@ge/contracts`, `@ge/design`, `@ge/agent-resolver`, `@ge/ui`); one shared `<Lifecycle>`
> across Journey/AgentDetail/deck; the deck→console identity thread (resolver + `agentId` stamping +
> deep-link); T3 runtime-task wiring; the full action-kind reconcile backlog (a/d neutralized by
> `<Lifecycle>` gating, b/c/e/f done); and all loose ends/polish (Repair-Queue integrity, Doctor
> seed, Autopilot + Fleet confirm-gates, `#/activity?task=`, PlaneCard, breadcrumbs). Suite green
> throughout. Remaining: an end-to-end in-browser/daemon pass (UX confirmation only).
> Derived from a 14-agent console UX root-cause analysis and an 8-agent pixelpitch/presentation
> study (both adversarially reviewed). This doc is the single reference for the program.

## Context

The GE Agent Factory ships two front-ends that feel like separate products:

- **`apps/console`** — the operational control surface (Overview, Journey/"Pipeline", Interview,
  SpecReview, Fleet, AgentDetail, Autopilot/"Repair Queue", Activity/"Runs", Doctor/"Readiness").
- **`apps/presentation`** — the narrative **deck**: a department → agent zoom story that can also
  provision agents (it already shares `factory-bridge.js` with the console).

They duplicate code (`design-tokens.ts` and `index.css` are **byte-identical**; the console
re-implements the deck's server layer), use **five disjoint id namespaces** for "an agent," and
hand off through `localStorage` instead of the URL. The result is disjointed.

## Why it feels disjointed (diagnosis)

There is **no shared spine**. The same agent's lifecycle is independently re-derived in ~7 console
places (Interview strip, Journey's planned-from-form graph, `AgentDetail` `fallbackStages`,
Fleet-health projection, Activity `summarizeNode`, Autopilot Run Plan, Overview `status.next`) **plus**
the deck's `FactoryProvisionPanel` `STAGES[]` — each with its own status words, action-kind enum,
next-action logic, and back-links. The contradictions live in the **data each surface receives**, not
just rendering: the server emits both legacy `agent.status` and derived `healthStatus`, so an agent is
"blocked" on Fleet and "Submitted" on Overview at once; one primary button sometimes runs work and
sometimes silently navigates; "Watch run" drops you in an unfiltered list because ~12 handoffs carry
no task id.

## Root cause

No single source of truth for an agent's lifecycle that is **agent-addressable** and **task-threaded**:

1. **No resolver** across the 5 id namespaces — deck catalog id (`uc-101`/`A-101`), title-derived
   `useCaseId`, scenario slug, `workspaceId`, mission/runtime task id. `AgentDetail.tsx:91-94`
   collapses three into the catalog id *because no thread exists*.
2. **The served journey plan is recomputed per request with `tasks=[]`** (`ge-api.mjs:~94`,
   `factory-core.mjs journeyPlan() ~line 1032`), so `journey-plan.mjs`'s own `applyRuntimeTasks` is
   **dead server-side** — the plan carries no real task ids/blockers/resume state.
3. **No per-agent plan is persisted**, so nothing survives reload or is identical across machines.

Identity is also genuinely **lossy at the factory boundary**: `UseCaseSlide` never passes its stable
`uc-101` into provisioning; `submitFactoryRun` mints a fresh `run-…` id and drops it.

## The foundational mechanism

**One server-authored, agent-keyed, task-threaded `ge.journey.plan` that every surface renders from.**
The shape and logic already exist in `tools/lib/journey-plan.mjs` (`buildJourneyPlan` +
`applyMissionGraph`/`applyRuntimeTasks`); the durable substrate is the mission DAG in
`mission-plan.mjs`/`runtime-daemon.mjs` (`childTaskId`, `resumeAttempts`, persisted in task
`output.graph`). Making it canonical is three honest builds: **(a) a resolver**, **(b) wiring real
tasks/graph into the served plan**, **(c) persisting the plan per agent**. Then every view — console
*and* deck — renders it through **one `<Lifecycle>` component + one status helper + one action-kind
enum with a real executor per kind** (each kind mapped to a `ge-command-registry.mjs` entry for
risk/confirm-gating).

## The presentation ↔ console tie

- **Shared canonical object:** `ge.journey.plan`, per-agent, typed in `@ge/contracts`. The deck's
  9-stage `FactoryStage` enum maps onto journey stages; its SSE artifacts populate the same
  `stage.status`. Deck `FactoryProvisionPanel` and console views render the **same** object via the
  **same** `<Lifecycle>`.
- **One identity thread:** the deck catalog id (`uc-101`) is the canonical `agentId`. Threaded:
  `UseCaseSlide` → `startFactoryRun` → `submitFactoryRun` stamps it into the run record →
  `factory-core` `fleetStatus` uses it as `FleetAgent.id` → `plan.agentId` → `ge-api` resolves it.
- **Navigation handoff:** deck provision deep-links into the console via existing URL primitives —
  `#/agent?id=<agentId>` (lifecycle) and `#/activity?task=<taskId>` (live run); console back-links to
  `presentation#<uc-id>`. Bridged with a pixelpitch-style typed postMessage protocol
  (`ge:focus-agent` / `ge:agent-state`).
- **Shared design system:** `@ge/design` — the byte-identical tokens + CSS, imported by both apps.

## What we port from pixelpitch

pixelpitch (the origin monorepo) shares **all** cross-app code through versioned workspace packages
(`@pixelpitch/*`, `workspace:*`), keystoned by a pure-TS, zod-only `packages/contracts` (every
web↔daemon DTO, the `TaskStatus` set, SSE event unions), with business logic in **loader-injected,
fs-free** packages (`plugin-runtime`, `agui-adapter`: "daemon emits, web/CI consumes"). We mirror:

- `packages/*` workspace model (`@ge/*`) — ge has the `workspaces` field but **no `packages/` dir**.
- `@ge/contracts` (pure TS, zod-only, no fs/react/express) as the one shared shape.
- `@ge/factory-bridge` — port the 757-line `factory-bridge.js` to a loader-injected package both
  apps import (today only the deck has it; the console re-implements it).
- One-descriptor-many-renderers (pixelpitch `renderer-registry`) → `ge.journey.plan` rendered by
  console `<Lifecycle>`, deck stage row, and embedded panel.
- host↔surface postMessage protocol (pixelpitch `srcdoc.ts` `od:slide`) → `ge:focus-agent`.
- Per-dir `AGENTS.md` boundary discipline + a TypeScript-first residual-JS gate.

## Shared packages to extract

| Package | Purpose |
|---|---|
| `@ge/contracts` | pure-TS/zod: `JourneyPlan`, `JourneyStage`, `FleetAgent`, `FleetActionPlan`, action-kind union, status sets, `FactoryStage`↔journey-stage map, `DesignTokens` interface |
| `@ge/design` | shared `design-tokens.ts` + `tokens.css` (the byte-identical files, deduped) |
| `@ge/factory-bridge` | loader-injected port of `factory-bridge.js`; stamps canonical `agentId` |
| `@ge/journey` | typed port of `journey-plan.mjs` + `mission-plan.mjs` + `ge-command-registry.mjs` |
| `@ge/agent-resolver` | `resolve(anyId) → canonicalAgentId` across the 5 namespaces |

## Roadmap (waves & teams)

Adversarially corrected. **File ownership is the conflict-avoidance primitive**; each team works an
isolated worktree off `main`; the two shared `.mjs` hotspots (`ge-api.mjs`, `factory-core.mjs`) are
split by function/section and otherwise serialized.

- **Wave 0 — T0 Monorepo scaffold (serial, blocks all):** `workspaces: ["apps/*","packages/*"]`,
  `@ge/*` shells + per-dir `AGENTS.md`, root `AGENTS.md`, `build:packages`.
- **Wave 1 (parallel):** **T2 `@ge/design`** (byte-identical extraction, build-validated),
  **T1a `@ge/contracts`** structural type-lift (no vocab reconciliation), **T9** craft/residual-JS
  gates (warn-only), plus **zero-dep quick wins pulled forward** (PlaneCard down=green; Repair-Queue
  data-integrity merge; Doctor prefetch seed; `#/activity?task=` handoffs).
- **Wave 1.5 — design spikes (RESOLVED 2026-06-14; safe lift landed):** see "Spike outcomes" below.
  - **Action-kind** — actually **five** vocabularies (added `fleet-health.mjs`, with a SINGULAR
    `build_agent`). The byte-faithful lift (name the five unions + the existing 9-member executable set +
    an alias map + a descriptive `DispatchMode` table + orphan classification) is **done** in
    `@ge/contracts/action-kinds.ts` — zero behavior change. The behavior-changing reconciles are queued.
  - **Identity** — chosen mechanism: thread `slide.id` (`uc-…`) via a **`UsecaseIdContext`** at the
    `App` render boundary (NOT `cloneElement`, which would hit the `<Suspense>` wrapper not the lazy
    agent), with a title-derived fallback during migration. **Hard blocker:** `ge-mock from-usecase`
    must accept `uc-…` ids before the provision payload can switch.

### Spike outcomes (resolved 2026-06-14)

- **Canonical action-kind enum:** `start_interview, review_spec, run_mission, run_preview,
  build_agents, generate_evals, ship_agents, resume_harness, resume_mission, resume_autopilot,
  watch_runtime, inspect_blocker, none`.
- **The lift/reconcile line:** *lift* = only NAME/DOCUMENT strings already on the wire, or THREAD an
  unused optional prop/context (zero behavior change, safe now). *Reconcile* = add a kind to the
  executable set, rename a wire value, reroute a handler, or change the id reaching `factory-bridge`
  (behavior change, one PR each, behind the alias map).
- **Reconcile backlog (one PR each, ordered):** (a) collapse `resume_harness`/`rerun_harness`;
  (d) make `generate_evals` real (register `evals.generate` + daemon path) or formally demote;
  (f) unify singular `build_agent`→`build_agents` at `journey-plan.mjs` read site; (e) promote
  `resume_autopilot`/`repair_agent` into the shared executable set; (c) fix `run_preview` routing;
  (b) make consumers honor `DispatchMode` instead of the `isExecutableAction` boolean (broadest — last).
- **Identity sequence:** plumb `UsecaseIdContext` + optional `usecaseId` prop + optional
  `FactoryRunRequest.usecaseId` (safe) → clear the `ge-mock` `uc-` lookup blocker → ship
  `@ge/agent-resolver` (`uc-…` ⇄ `{title, agentId A-…, domain, workspaceSlug}`) → flip
  `FactoryProvisionPanel` to send `usecaseId` and delete `toUseCaseId(title)`.
- **Dependency blocks:** **T3** can't switch dispatch on daemon `nextAction` until alias map (done) +
  reconcile-a land. **T7** `<Lifecycle>` can be BUILT against the descriptive `DispatchMode` now, but
  must not switch real dispatch until reconcile-b. **T4** is hard-blocked by the `ge-mock` `uc-`
  lookup and the `<Suspense>`-clone hazard (→ use context).
- **Wave 2 — T3 runtime-task wiring** (kills the dead `applyRuntimeTasks` path; adds a daemon fetch to
  `/api/ge/journey` with graceful planned-only degrade) + **T4 `@ge/agent-resolver` + identity
  stamping**.
- **Wave 3 — T5 `@ge/journey`** (typed port) + **T6 `@ge/factory-bridge`** (loader-injected port,
  stamps `agentId`).
- **Wave 4 — T7 `<Lifecycle>`** renderer + replace the 7 console re-derivations and the deck
  `FactoryProvisionPanel`.
- **Wave 5 — T8 cross-surface bridge** (typed postMessage + deep-link handoff, prefixed-id resolver).

## Key risks
- Action-kind vocab is **four** namespaces, not one (the keystone reconciliation); on the critical
  path — split structural lift (T1a) from reconciliation (T1b).
- Identity threading is a ~70-callsite fan-out hiding behind "pass `agent.id`".
- Tailwind v4 + `@tailwindcss/vite` ignores `node_modules` by default — extract design CSS via each
  app's `index.css` `@import`/`@source`, validate **built CSS** (class presence), not a source diff.
- `ge-api.mjs`/`factory-core.mjs` are de-facto serialization points (split by function).
- Don't share React state — share only types (`@ge/contracts`), the server-emitted plan,
  `@ge/design` tokens, and pure transforms (`@ge/journey`).

## Quick wins (independent of the spine — ship first)
1. `#/activity?task=<id>` handoffs + Activity reads it (the most-cited continuity break, ~12 sites).
2. `PlaneCard` down=green bug (`PlaneCard.tsx:18` hardcodes the green wrapper).
3. Merge daemon `autopilot.run` repairs into the Repair Queue (it reads only the SQLite
   `autopilot_runs` table → silently incomplete).
4. Seed Doctor from the prefetched report instead of re-streaming `scope=all` on entry.
5. Confirm-gate destructive actions (Fleet push, Autopilot "repair all up to 250") via registry risk.
