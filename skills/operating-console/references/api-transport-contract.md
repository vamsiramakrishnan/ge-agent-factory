# API Transport Contract

The console has three layers:

```text
geClient.ts -> ge-api.mjs -> transport.mjs -> factory-core.mjs
```

## Rules

- `ge-api.mjs` should route and return sentinels. It should not own long-running process execution.
- `transport.mjs` should execute, persist, stream, and resume.
- `job-store.mjs` should store durable state for jobs and Autopilot.
- `factory-core.mjs` should own GE business logic shared by CLI, console, and harnesses.

## Mutating Command Pattern

1. Add command metadata to `packages/capability-registry/src/registry.mjs`.
2. Expose route through `commandForRoute`.
3. Return `{ job, command, cfg }` from `ge-api.mjs`.
4. Start via `startGeJob` in `transport.mjs`.
5. Add client method in `geClient.ts`.
6. Add route sentinel tests.

## Autopilot Pattern

Autopilot runs must persist:

- run id
- target stage
- mission snapshot
- item roster
- item statuses
- event stream

Do not rely on in-memory state for resume.

