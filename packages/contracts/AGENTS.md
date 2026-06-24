# @ge/contracts

The single typed shape every GE surface agrees on (console, presentation, and the `.mjs` tools via
JSDoc). Keystone of the `packages/*` model (mirrors `pixelpitch/packages/contracts`).

Boundary: **pure TypeScript**. No `node:fs`/`process`, no React, no Express, no SQLite, no app
imports. Types (and, later, zod schemas) only — the validated target shapes both an emitter (the
server) and consumers (the apps) depend on.

- `src/journey.ts` — the canonical `ge.journey.plan` (`JourneyPlan`/`JourneyStage`) plus the fleet
  shapes (`FleetAgent`, `FleetActionPlan`, `FleetBlocker`, `FleetHealth`, `Fleet`) and
  `MissionArtifactRef`. Lifted from `apps/console/src/services/geClient.ts`; the console now
  re-exports these from here.

New cross-app DTOs belong here, not in an app's `geClient.ts`. The action-kind union + status sets
(currently in `actionPlans.ts` / `journey-plan.mjs`) are the next additions, after the action-kind
reconciliation spike settles the canonical set.
