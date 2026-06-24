# Presentation per-agent deployment UI — design

**Date:** 2026-06-17
**Status:** Approved, implementing
**Sub-project:** 2 of 3

## Goal

Make the per-agent deploy panel on the agent-detail slide **clearer and safer**, and let it
**consume** a console-authored spec. No interview/upload embedded here — the console hosts the
full interview (sub-project 1); the presentation only consumes its output.

## Decisions (locked)

- **Console hosts; presentation consumes.** No upload/parse/interview in the presentation.
- Improve the deploy UX **with no backend changes** — the `factory-bridge` contract is stable and
  already accepts a UI-authored `generationSpec` and a `prebuiltArchive` with `startStage`.

## Current state

`apps/presentation/src/components/agent/FactoryProvisionPanel.tsx`, mounted at the top of every
`UseCaseSlide.tsx`:

- "Factory Control" card: config accordion (project, region, Gemini Enterprise app id via
  `getGeminiAgents`, location, SA), optional "Run Preflight Check", and a primary "Provision".
- `factoryClient.startFactoryRun` → `POST /api/factory/usecase` →
  `server/factory-bridge.js submitFactoryRun` (prod: GCS index → scaffold → tar+upload → Firestore
  queued → Cloud Tasks; local: shells `ge-demo-generator`).
- Progress via GCS-poll-over-SSE → shared `<Lifecycle>` 8-stage tracker → "Open in Console".
- The spec is a hardcoded `UseCaseGenerationSpec` `const` (`types/architecture.ts`) per slide.

## Changes (all in-app, no backend change)

1. **Preflight as a checklist.** `preflightTarget` already returns structured `checks[]`
   (id/label/status/detail); render the full list, not one collapsed badge.
2. **Review/confirm before Provision.** A "what will be generated" summary derived from the slide's
   `UseCaseGenerationSpec` (entity counts, source systems, row policy, doc count, anomalies) so
   Provision is no longer a blind fire. Provision is gated behind this confirm.
3. **Render the `generationSpec`** (collapsed, read-only) — it's already a clean artifact schema
   (`entities`, `sourceSystems`, `documents`, `apis`, `anomalies`, `behaviorContract`, `validation`).
4. **Consume a console spec.** A "Use spec from console" path that POSTs an interview-authored
   `generationSpec` or a `prebuiltArchive` with `startStage='load_data'`. The seam exists:
   `submitFactoryRun` already accepts both — frontend-only wiring + a deep-link param
   (`?spec=<ref>` / `?archive=<gcsUri>`).
5. **Richer progress.** Per-stage detail/log/artifact links in `<Lifecycle>` instead of 8 terse
   labels + a last-error string.
6. **Disambiguate the two deploys.** Visually distinguish `FactoryProvisionPanel` (deploy *this*
   agent) from `DeployYourOwnSlide.tsx` (install the *whole* factory) — heading, iconography,
   copy.

## Components — new vs modified

**New**
- `components/agent/PreflightChecklist.tsx` — renders `checks[]`.
- `components/agent/ProvisionReview.tsx` — "what will be generated" summary + confirm.
- `components/agent/GenerationSpecView.tsx` — collapsed read-only spec render.

**Modified**
- `components/agent/FactoryProvisionPanel.tsx` — compose the three new components; add the
  consume-console-spec path; gate Provision behind review.
- `services/factoryClient.ts` — accept `generationSpec` / `prebuiltArchive` / `startStage`
  passthrough (types only; bridge already supports).
- `components/shared/Lifecycle.tsx` (or wherever the tracker lives) — per-stage detail slots.
- `components/onboarding/DeployYourOwnSlide.tsx` — copy/visual to disambiguate.

## Error handling

- Preflight failure → checklist shows failed checks with detail; Provision disabled until green or
  explicit override.
- Consume-spec: validate the inbound `generationSpec` shape (reuse `types/architecture.ts`) before
  POST; bad archive URI → inline error.

## Testing

- Extend `server/factory-bridge.test.js` for the `prebuiltArchive` + `generationSpec` consume path
  (`startStage='load_data'`).
- Component tests: `PreflightChecklist` (status states), `ProvisionReview` (summary derivation +
  confirm gate), `GenerationSpecView` (render of a representative spec).

## Phased implementation

1. `PreflightChecklist` + wire `checks[]`.
2. `GenerationSpecView` + `ProvisionReview` + gate Provision behind confirm.
3. Consume-console-spec path (`factoryClient` passthrough + deep-link param) + bridge test.
4. `<Lifecycle>` per-stage detail + deploy disambiguation.

## Out of scope (follow-ups)

- In-presentation interview/spec authoring (stays in console).
- Any change to `factory-bridge.js` provisioning semantics.
