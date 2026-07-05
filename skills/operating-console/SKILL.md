---
name: operating-console
description: Operates and extends the GE console. Use when working on apps/console command registry, persisted jobs, preflight checks, activity streams, Autopilot, Mission Contract display, workspace gates, or API route sentinels.
---

# Operating Console

Use this skill when working in `apps/console` or explaining how the console exposes factory state to users.

Core model:

```text
Console UI -> geClient -> ge-api route sentinels -> transport -> factory-core
```

Do not put business logic only in React. Shared behavior belongs in `tools/lib/*` or server transport.

## Assembly-Line Slot

In plain language: this skill is for the operator console, which is one of the three control-plane surfaces alongside CLI and MCP. The console should not invent its own factory logic. It should show the operator what the shared core knows, start long-running work safely, stream progress, persist state, and make local/remote capability obvious.

- **First step:** identify which console surface maps to the operator action: status, command job, mission, Autopilot, workspace gate, or artifact.
- **Plays a role in:** the control plane surface from slide 21: Web console -> `/api/ge/*` -> transport -> `factory-core`.
- **Input:** operator intent from UI, command palette, or API request.
- **Output:** route sentinel, persisted job/run state, SSE stream, or rendered operational state.
- **Next step:** core/transport executes or observes the relevant assembly-line station; UI shows mode capability, blockers, artifacts, and resume controls.

Use this skill when the question is “how should the console expose this factory capability?” The answer should usually be: keep shared behavior in `factory-core` or transport, route it through `ge-api`, type it in `geClient`, and make the UI clear about what is happening now and what can safely happen next.

## Workflow

1. Identify whether the change is UI, route, transport, persistence, or core.
2. For mutating GE commands, use the shared command registry:
   - `packages/capability-registry/src/registry.mjs`
   - `apps/console/src/shared/ge-commands.mjs`
3. For long-running commands, return a job sentinel from `ge-api.mjs`; let `transport.mjs` persist and stream it.
4. For Autopilot, persist run intent and items in `job-store.mjs`; do not keep resumability only in memory.
5. For Mission Contract behavior, call `/api/ge/mission` and display the contract instead of duplicating mode/stage rules.
6. Add route-sentinel tests in `apps/console/src/server/ge-api.test.mjs`.

## Source Files

- Shell routes: `apps/console/src/App.tsx`
- Client API: `apps/console/src/services/geClient.ts`
- API routing: `apps/console/src/server/ge-api.mjs`
- Runtime transport: `apps/console/src/server/transport.mjs`
- Persistence: `apps/console/src/server/job-store.mjs`
- Autopilot view: `apps/console/src/views/Autopilot.tsx`
- Doctor view: `apps/console/src/views/Doctor.tsx`
- Agent detail gates: `apps/console/src/views/AgentDetail.tsx`
- Command palette: `apps/console/src/components/shell/CommandPalette.tsx`

## Scripts

Audit that key console routes and operators are still wired:

```bash
node skills/operating-console/scripts/audit-console-surface.mjs
```

## Local/Remote UX Rules

- Show `modeContract`, not just `mode`.
- Local mode can offer doctor/repair actions.
- Remote mode should show observation/handoff behavior and avoid repair wording unless a synced local workspace exists.
- Any resume button must resume the persisted run mission, not the current filter state.

## Validation

Run:

```bash
bun test apps/console/src/server/ge-api.test.mjs apps/console/src/server/transport.test.mjs
bun run typecheck
node --check apps/console/src/server/ge-api.mjs
node --check apps/console/src/server/transport.mjs
node --check apps/console/src/server/job-store.mjs
```

## References

- Read `references/example-session.md` when asked to add a console action/route/button — a worked session (registry check → entry → sentinel test → validation, with real test output) plus the surface-audit failure variant.
- Read `references/assembly-line-role.md` to understand where this skill fits in the Agent Factory assembly line.
- Read `references/api-transport-contract.md` before adding console APIs or background jobs.
- Read `references/ui-operating-model.md` before changing operator-facing UI flows.
