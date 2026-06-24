# Week 6: Generated Data And Frontend Guardrails

## Goal

Reduce source bloat from generated catalogs and add guardrails around frontend behavior. The target is faster development, smaller review surfaces, better dev/prod parity, and fewer UI regressions.

## Primary Risks Addressed

- Generated catalog data loaded as massive JS/TS source modules.
- Hundreds of manually registered slide components and large generated TSX files.
- Frontend dev/prod API route drift.
- Thin tests and weak TypeScript settings.
- Secrets exposed to client bundle definitions.

## Scope

### 1. Move Generated Catalogs Out Of Runtime Source

Target areas:

- `apps/ge-demo-generator/src/use-cases.generated.js`
- `apps/ge-demo-generator/src/domains.generated.js`
- `tools/lib/factory-core.mjs`
- `apps/ge-demo-generator/src/server.js`

Implementation tasks:

- Store generated use cases as JSON, SQLite, or another data artifact.
- Add schema validation at generation time.
- Add indexed lookup and pagination for runtime APIs.
- Lazy-load catalog data only in endpoints or commands that need it.
- Keep compatibility exports temporarily if needed for gradual migration.

Acceptance criteria:

- Runtime no longer imports a 387k-line JS module at startup.
- Catalog API returns paginated results.
- Invalid generated data fails validation during generation, not at runtime.

### 2. Make Presentation Slides Data-Driven

Target areas:

- `apps/presentation/src/config/slides.tsx`
- `apps/presentation/src/components/slides/use-cases/**`
- `apps/presentation/src/components/agent/UseCaseSlide.tsx`

Implementation tasks:

- Move embedded specs out of individual TSX slide files.
- Build a generated slide manifest.
- Use `import.meta.glob` or a generated registry for component loading.
- Keep TSX focused on reusable templates.
- Precompute navigation indexes:
  - `slidesById`
  - `childrenByParent`
  - `slidesByLevel`
  - `departmentLandingByDepartment`.

Acceptance criteria:

- Adding a use case does not require manually editing a 600-line registry.
- Finance, IT, marketing, HR, and procurement navigation is data-driven.
- Existing slide routes remain stable.

### 3. Fix Frontend Behavioral Bugs

Target areas:

- `apps/presentation/vite.config.ts`
- `apps/presentation/server.js`
- `apps/presentation/src/services/factoryClient.ts`
- `apps/console/src/App.tsx`
- `apps/console/src/views/AgentDetail.tsx`
- `apps/console/src/server/transport.mjs`
- `apps/console/src/components/JobToast.tsx`

Implementation tasks:

- Share factory API routing between Vite dev and Bun production, or add parity tests for both.
- Add missing `/api/factory/agents` route in dev.
- Pass console runtime `status` into `AgentDetail`.
- Centralize runtime mode in React context.
- Update job UI to use job-terminal events.
- Remove `process.env.GEMINI_API_KEY` from Vite client `define`.

Acceptance criteria:

- Presentation dev and prod expose the same factory API routes.
- Console local-mode agent detail actions use local mode.
- Client bundle does not define private API keys.

### 4. Add Frontend Tests

Target areas:

- `apps/presentation`
- `apps/console`
- `apps/ge-demo-generator/web`

Implementation tasks:

- Add Vitest/Testing Library coverage for:
  - navigation index helpers
  - factory API client
  - run/session reducer
  - console mode propagation.
- Add Playwright smoke tests for:
  - presentation keyboard navigation
  - factory settings
  - run/cancel lifecycle
  - console fleet detail
  - generator session switching.
- Add fixture-based tests for dev/prod API route parity.

Acceptance criteria:

- Critical frontend flows have automated coverage.
- Broken API parity fails CI.
- Run/cancel lifecycle has regression tests.

### 5. Tighten TypeScript Gradually

Target areas:

- `apps/presentation/tsconfig.json`
- `apps/console/tsconfig.json`
- generated code boundaries.

Implementation tasks:

- Enable `strict` for non-generated code first.
- Keep generated data behind typed schema loaders.
- Disable `allowJs` where practical.
- Add explicit generated-code exclusions if needed.

Acceptance criteria:

- Non-generated frontend code typechecks under stricter settings.
- Generated artifacts do not dominate typecheck failures.

## Suggested PR Breakdown

1. Catalog data migration.
2. Slide manifest and navigation indexes.
3. Frontend bug fixes.
4. Frontend test harness and smoke tests.
5. TypeScript strictness pass.

## Validation

- Run presentation and console typechecks.
- Run frontend unit tests.
- Run Playwright smoke tests.
- Compare dev and production route lists.
- Verify bundle does not include private key definitions.

## Implementation Details

### Catalog Data Layout

Move generated data from JS modules to data artifacts:

```text
apps/ge-demo-generator/data/catalog/
  use-cases.json
  domains.json
  catalog.schema.json
  catalog.index.json
```

`catalog.index.json` should contain lightweight lookup data:

```json
{
  "version": 1,
  "departments": ["finance", "hr", "it", "marketing", "procurement"],
  "useCasesByDepartment": {
    "hr": ["benefits-assistant"]
  },
  "titles": {
    "benefits-assistant": "Benefits Assistant"
  }
}
```

Runtime loader:

- `apps/ge-demo-generator/src/catalog/catalog-store.js`
  - `listUseCases({ department, search, limit, offset })`
  - `getUseCase(id)`
  - `listDomains({ department })`
  - `validateCatalog()`.

The loader should avoid loading the full catalog for simple counts or paginated list endpoints.

### Catalog Generation Validation

Add a generation step:

```bash
bun apps/ge-demo-generator/scripts/validate-catalog.mjs
```

Validation checks:

- unique IDs.
- valid department.
- required fields present.
- no oversized fields beyond agreed limits.
- stage/tool references use known values.
- schemas match `catalog.schema.json`.

CI should fail if generated data does not validate.

### Presentation Slide Manifest

Create:

```text
apps/presentation/src/config/slide-manifest.generated.ts
apps/presentation/src/config/slide-index.ts
```

Manifest shape:

```ts
export interface SlideManifestItem {
  id: string;
  title: string;
  level: number;
  department?: "finance" | "hr" | "it" | "marketing" | "procurement";
  parentId?: string;
  componentKey: string;
  useCaseId?: string;
}
```

Loader:

```ts
const modules = import.meta.glob("../components/slides/**/*.tsx");

export function resolveSlideComponent(componentKey: string) {
  const loader = modules[componentKey];
  if (!loader) throw new Error(`Unknown slide component: ${componentKey}`);
  return lazy(loader as any);
}
```

Navigation indexes:

```ts
export const slidesById = new Map(SLIDES.map((slide) => [slide.id, slide]));
export const childrenByParent = groupBy(SLIDES, (slide) => slide.parentId || "root");
export const departmentLandingByDepartment = new Map(
  SLIDES.filter((slide) => slide.kind === "department-landing").map((slide) => [slide.department, slide.id])
);
```

Replace hardcoded branch logic in `App.tsx` with index lookups.

### Frontend API Parity

Create one shared router implementation for presentation factory routes:

```text
apps/presentation/src/server/factory-routes.js
```

Exports:

- `handleFactoryRequest(req)`
- `routeFactoryRequest({ method, pathname, searchParams, body })`

Use it from:

- `apps/presentation/server.js`
- `apps/presentation/vite.config.ts`.

Add parity test:

- `apps/presentation/src/server/factory-routes.parity.test.js`
  - asserts dev and prod route tables include:
    - `POST /api/factory/preflight`
    - `GET /api/factory/agents`
    - `POST /api/factory/usecase`
    - `GET /api/factory/runs/:id`
    - `GET /api/factory/runs/:id/events`.

### Console Runtime Mode Fix

Implementation:

- Add `ConsoleStatusContext`.
- Populate from `useActivity` or the overview status fetch.
- Pass mode/project through context, not manually down every component.
- Update `AgentDetail` to read mode from context.
- Still allow explicit prop override in tests.

Test:

- render `App` with mocked status `{ mode: "local" }`.
- navigate to agent detail.
- assert build action includes local mode.

### Run Session Client

Create shared frontend helper:

```text
apps/shared/run-session-client.ts
```

or per app if no shared package exists:

```text
apps/presentation/src/services/runSessionClient.ts
apps/ge-demo-generator/web/src/services/run-session-client.js
```

API:

```ts
class RunSession {
  start(): Promise<void>
  cancel(): Promise<void>
  dispose(): void
  onEvent(callback): () => void
}
```

Features:

- owns `AbortController`.
- closes active reader on cancel.
- retries only for reconnectable read failures.
- emits explicit terminal states.

### Remove Secret Bundle Footgun

In `apps/presentation/vite.config.ts`:

- remove `process.env.GEMINI_API_KEY` from `define`.
- expose only `import.meta.env.VITE_*` values.
- add a test or grep script that fails if `GEMINI_API_KEY` appears in built JS.

### Testing Stack

Add where missing:

- Vitest for unit/component tests.
- Testing Library for React surfaces.
- Playwright for smoke flows.

Suggested tests:

- `apps/presentation/src/config/slide-index.test.ts`
  - department landing lookup for all departments.
  - no orphan parent IDs.
  - every manifest component resolves.
- `apps/presentation/src/services/factoryClient.test.ts`
  - handles `/api/factory/agents`.
  - handles run snapshot errors.
- `apps/console/src/views/AgentDetail.test.tsx`
  - local mode actions.
  - remote mode actions.
- `apps/ge-demo-generator/web/src/services/run-session-client.test.js`
  - cancel aborts reader.
  - terminal events close session.
- `tests/playwright/console-smoke.spec.ts`
  - fleet -> agent detail -> run -> cancel.
- `tests/playwright/presentation-smoke.spec.ts`
  - keyboard navigation and factory settings.

### Incremental Strict TypeScript

Add `tsconfig.strict.json` first:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  },
  "exclude": [
    "src/config/*.generated.ts",
    "src/components/slides/use-cases/generated/**"
  ]
}
```

Then add script:

```json
"typecheck:strict": "tsc -p tsconfig.strict.json --noEmit"
```

Start with console and shared services before enforcing on generated presentation slide files.

### Rollout Steps

1. Add catalog JSON artifacts while keeping compatibility JS exports.
2. Move runtime readers to catalog-store.
3. Add slide manifest and indexes.
4. Replace hardcoded navigation.
5. Fix dev/prod API parity and console mode.
6. Add tests.
7. Tighten TypeScript for non-generated code.

## Out Of Scope

- Deep visual redesign.
- IAM/security changes.
- Full backend service decomposition.
