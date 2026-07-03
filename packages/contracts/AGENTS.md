# @ge/contracts

The single typed shape every GE surface agrees on (console, presentation, and the `.mjs` tools via
JSDoc). Keystone of the `packages/*` model (mirrors `pixelpitch/packages/contracts`).

Boundary: **pure TypeScript**. No `node:fs`/`process`, no React, no Express, no SQLite, no app
imports. Types (and, later, zod schemas) only — the validated target shapes both an emitter (the
server) and consumers (the apps) depend on.

- `src/pipeline.ts` — the canonical `ge.pipeline.plan` (`PipelinePlan`/`PipelineStage`) plus the
  fleet shapes (`FleetAgent`, `FleetActionPlan`, `FleetBlocker`, `FleetHealth`, `Fleet`) and
  `PipelineArtifactRef`. Lifted from `apps/console/src/services/geClient.ts`; the console now
  re-exports these from here.
- `src/action-kinds.ts` — the action-kind vocabularies (plan/fleet/daemon), the registry command
  ids (`GeCommandIdSchema`), risk levels, and the executable-kind/dispatch-mode sets.

New cross-app DTOs belong here, not in an app's `geClient.ts`.
