# Parallel Mechanism Refactor Plan

This plan decomposes the current structural cleanup into parallel tracks that can be executed by less capable coding agents. The theme is mechanism over patch: unify scattered contracts, remove god classes, and make runtime, mission, simulator, console, and harness surfaces interoperate through shared modules.

## Ground Rules

- Start every task with `git status --short`.
- Do not revert or edit unrelated dirty files.
- Work on a separate branch or patch stack per agent.
- Keep public CLI commands and API paths stable unless the task explicitly says otherwise.
- Extract modules behind existing APIs first; do not rewrite behavior and extraction in the same step unless the task requires it.
- Add focused tests for every extracted module.
- Avoid generated files unless the task is explicitly about generation or source hygiene.
- If two agents need the same file, the owner listed in this plan edits it first; dependent agents wait or rebase.

## Execution Protocol For Lower-Capability Agents

Use this protocol for every task in this plan. Do not skip steps.

1. Create or switch to a task branch:

   ```bash
   git checkout -b refactor/<agent-letter>-<short-name>
   ```

   If the branch already exists, use it:

   ```bash
   git checkout refactor/<agent-letter>-<short-name>
   ```

2. Record the starting state:

   ```bash
   git status --short
   git log --oneline -3
   ```

3. Read only the files named in your assigned task. Do not browse the whole repo unless a named import fails.
4. Make one mechanical extraction at a time:
   - add the new module
   - copy or move one helper/function group
   - import it from the old file
   - run a syntax check
   - run the smallest relevant test
5. Do not rename public functions unless the task explicitly tells you to.
6. Do not change generated output formatting unless the task explicitly tells you to.
7. If a test fails, do not make broad changes. First identify whether the failure is:
   - import path mistake
   - missing export
   - changed JSON shape
   - changed command argv
   - changed timestamp/random value
8. Commit only the files from your task. Use explicit `git add <file>`.
9. In your final note, include:
   - files changed
   - tests run
   - any skipped tests and why
   - any remaining blockers

## Small-Model Dry-Run Requirement

Every agent task in this plan should be validated with a cheaper/faster model before a stronger model or human spends implementation time on it. The dry run is not allowed to edit code. Its job is to find ambiguity in the task instructions.

Use a maximum spend cap of `$5` per dry run. Ask the model to:

- identify the first three files it would open
- identify the first exact function or type it would move/change
- list any hidden dependencies, import cycles, or public API risks
- name the smallest first commit it would make
- state what it would explicitly not touch
- propose one test that would catch accidental behavior drift

After the dry run, update this plan before implementation if the model found ambiguity. Do not let the same model both critique and execute the task in one pass.

## Standard Module Style

Use this style for all new `.mjs` modules under `tools/lib`.

```js
// tools/lib/example-module.mjs

export function exampleFunction(input = {}) {
  return {
    ok: true,
    input,
  };
}
```

Use this style for tests.

```js
// tools/lib/example-module.test.mjs
import { test, expect } from "bun:test";
import { exampleFunction } from "./example-module.mjs";

test("exampleFunction returns stable shape", () => {
  expect(exampleFunction({ id: "x" })).toEqual({
    ok: true,
    input: { id: "x" },
  });
});
```

## Do Not Touch List

Unless your assigned task explicitly names one of these paths, do not edit:

- `apps/factory/src/use-cases.generated.js`
- `apps/factory/src/domains.generated.js`
- `apps/factory/src/agent-spec-registry.generated.json`
- `apps/factory/simulator-systems/_openapi/**`
- `.ge-daemon/**`
- `.ge-harness/**`
- `artifacts/**`
- `node_modules/**`
- `apps/console/dist/**`

## Safe Commit Checklist

Before every commit:

```bash
git status --short
git diff --stat
```

Confirm the diff contains only your assigned files. Then:

```bash
git add <only-your-files>
git commit -m "<area>: <specific mechanism>"
```

## Current Hotspots

- `apps/factory/scripts/factory.mjs`: large multi-responsibility CLI and pipeline script.
- `tools/lib/runtime-daemon.mjs`: daemon store, HTTP routing, scheduler, executors, resume, and event streaming in one module.
- `tools/lib/factory-core.mjs`: compatibility facade plus still-too-broad factory responsibilities.
- `tools/lib/mission-plan.mjs`: graph construction policy hard-coded in one function.
- `tools/lib/mission-node-registry.mjs`, `tools/lib/mission-nodes.mjs`, `apps/factory/src/simulator-sdk.js`: overlapping knowledge of mock/Snowfakery/simulator lifecycle.
- `apps/console/src/views/Activity.tsx`, `apps/console/src/views/Overview.tsx`, `apps/console/src/services/geClient.ts`: console interprets runtime semantics directly.
- `apps/factory/src/spec-workbench.js`, skills, mission planning, and simulator SDK: spec intake and golden-eval flow are not a single durable contract yet.

## Batch 1: Foundations

These tasks can run in parallel.

### Agent A: Runtime Contract

**Goal:** Create the canonical task/event/resume/artifact schema so daemon, CLI, console, and harnesses stop hand-shaping the same objects.

**Branch name:**

```bash
git checkout -b refactor/a-runtime-contract
```

**Primary files:**

- `tools/lib/runtime-daemon.mjs`
- `apps/console/src/services/geClient.ts`
- `apps/console/src/views/Activity.tsx`

**Add:**

- `tools/lib/runtime-contract.mjs`
- `tools/lib/runtime-contract.test.mjs`

**Steps:**

1. Add `tools/lib/runtime-contract.mjs`.
2. Export these functions:
   - `normalizeRuntimeTask(task)`
   - `normalizeRuntimeEvent(event)`
   - `normalizeResumePlan(plan, task)`
   - `normalizeArtifactRef(ref)`
   - `normalizeBlocker(blocker)`
   - `runtimeTaskPresentation(task)`
3. Move default shapes for `resumePlan`, blockers, artifact refs, and task summaries into this module.
4. Update `runtime-daemon.mjs` so persisted and returned tasks are normalized through this module.
5. Keep existing daemon JSON fields backward-compatible.
6. Update console types only after runtime output remains compatible.
7. Add tests for missing `resumePlan`, missing blockers, string blockers, malformed artifacts, and old task files.

**Detailed implementation recipe:**

1. In `tools/lib/runtime-daemon.mjs`, find the existing functions that produce task summaries/details. Search:

   ```bash
   rg "taskSummary|taskDetail|resumePlanFor|artifactRefs|blockers" tools/lib/runtime-daemon.mjs
   ```

2. Do not move all code at once. First create `runtime-contract.mjs` with no imports from daemon:

   ```js
   export function normalizeBlocker(blocker = {}) {
     if (typeof blocker === "string") return { id: "blocker", message: blocker };
     return {
       id: blocker.id || blocker.code || "blocker",
       message: blocker.message || blocker.error || blocker.detail || blocker.id || "blocked",
       detail: blocker.detail ?? blocker.data ?? null,
     };
   }

   export function normalizeArtifactRef(ref = {}) {
     return {
       name: ref.name || ref.id || ref.path || "artifact",
       type: ref.type || "file",
       path: ref.path || ref.resolvedPath || null,
       status: ref.status || "unknown",
       metadata: ref.metadata || {},
       ...ref,
     };
   }
   ```

3. Add `normalizeResumePlan(plan, task)` with this exact default shape:

   ```js
   export function normalizeResumePlan(plan = null, task = {}) {
     const state = plan?.state || task.status || "unknown";
     const safeToRun = Boolean(plan?.safeToRun);
     return {
       state,
       nextAction: plan?.nextAction || "none",
       safeToRun,
       reason: plan?.reason || "",
       commands: Array.isArray(plan?.commands) ? plan.commands : [],
       blockers: (plan?.blockers || task.blockers || []).map(normalizeBlocker),
       artifacts: (plan?.artifacts || task.artifactRefs || []).map(normalizeArtifactRef),
     };
   }
   ```

4. Add `normalizeRuntimeTask(task)` that preserves all existing fields with spread syntax, then normalizes standard fields:

   ```js
   export function normalizeRuntimeTask(task = {}) {
     const output = task.output || {};
     const artifactRefs = (task.artifactRefs || output.artifactRefs || []).map(normalizeArtifactRef);
     const blockers = (task.blockers || output.blockers || []).map(normalizeBlocker);
     const next = {
       ...task,
       id: task.id || "unknown-task",
       kind: task.kind || "unknown",
       status: task.status || "unknown",
       output,
       artifactRefs,
       blockers,
     };
     return {
       ...next,
       resumePlan: normalizeResumePlan(task.resumePlan || output.resumePlan, next),
       presentation: runtimeTaskPresentation(next),
     };
   }
   ```

5. Keep `runtimeTaskPresentation(task)` boring. It should not invent new status. It should summarize existing data:

   ```js
   export function runtimeTaskPresentation(task = {}) {
     const title = task.summary || `${task.kind || "task"} ${task.id || ""}`.trim();
     const blocker = (task.blockers || [])[0];
     return {
       title,
       subtitle: blocker?.message || task.resumePlan?.reason || task.status || "",
       statusTone: ["failed", "blocked"].includes(task.status) ? "danger" : task.status === "done" ? "success" : "default",
       primaryAction: task.resumePlan?.safeToRun ? task.resumePlan.nextAction : "inspect",
       secondaryActions: task.resumePlan?.commands || [],
       artifactSummary: `${(task.artifactRefs || []).length} artifact(s)`,
       blockerSummary: blocker?.message || "",
     };
   }
   ```

6. Only after tests pass, import `normalizeRuntimeTask` in daemon and wrap return values from task summary/detail functions.
7. Do not change the daemon HTTP route paths.
8. Do not convert the console to use `presentation` in this task unless it is a tiny type addition. Agent E owns React rendering changes.

**Small-model dry-run clarifications:**

- Do not change the internal `resumePlanFor()` logic in this task. `normalizeResumePlan()` should normalize the output of `resumePlanFor()` at the boundary, not rewrite resume decisions.
- Treat `presentation` as additive and optional. Old task JSON files will not have it; TypeScript must declare `presentation?: ...`.
- Prefer wrapping daemon task responses at HTTP/API return boundaries first. Do not mutate internal run files merely to add presentation data.
- If wrapping `taskSummary()` or `taskDetail()` directly creates test churn, revert that part and instead normalize inside the route handler response for `GET /api/tasks` and `GET /api/tasks/:id`.
- Add at least one old-task fixture/test with no `resumePlan`, no `blockers`, string blockers, and artifact refs under `output.artifactRefs`.
- Add at least one mission-task fixture/test with mixed artifact sources: task-level `output.artifactRefs` plus `output.graph.nodes[*].artifacts`. The normalizer must not crash or drop task-level artifacts.

**Minimum tests to write:**

- string blocker becomes `{ id: "blocker", message: "..." }`
- missing resume plan returns `nextAction: "none"`
- artifact with only `path` gets a name and default type
- task with historical output-only artifact refs normalizes them

**Acceptance criteria:**

- Existing runtime daemon tests pass.
- Console can still render historical tasks.
- A task without `resumePlan`, `blockers`, or `artifactRefs` does not crash UI.
- New task output has stable `presentation`, `resumePlan`, `blockers`, and `artifacts`.

**Verification:**

```bash
bun test tools/lib/runtime-contract.test.mjs tools/lib/runtime-daemon.test.mjs
bun --cwd apps/console run lint
```

### Agent B: Mission Node Registry

**Goal:** Stop hard-coding mission graph node behavior inside `buildMissionGraph()`.

**Branch name:**

```bash
git checkout -b refactor/b-mission-node-registry
```

**Primary files:**

- `tools/lib/mission-plan.mjs`
- `tools/lib/mission-node-registry.mjs`
- `tools/lib/mission-nodes.mjs`

**Steps:**

1. Expand `mission-node-registry.mjs` so each node kind can declare:
   - `kind`
   - `runtimeKind`
   - `label`
   - `buildInput(context)`
   - `artifacts(input)`
   - `dependsOn(context)`
   - `safeToRun(input)`
   - `validateArtifacts(options)`
   - `presentation(node)`
2. Register existing node kinds:
   - `preflight.doctor`
   - `antigravity.spec-data-review`
   - `mock.generate`
   - `snowfakery.generate`
   - `simulator.seed`
   - `simulator.validate`
   - `factory.build`
   - `autopilot.converge`
3. Keep node IDs unchanged.
4. Update `buildMissionGraph()` to compose nodes by asking the registry for definitions.
5. Keep mission graph JSON shape compatible.
6. Add tests proving node definitions are complete and graph order/dependencies are unchanged.

**Detailed implementation recipe:**

1. First add a registry map without changing `buildMissionGraph()`:

   ```js
   const DEFINITIONS = new Map();

   export function registerMissionNodeDefinition(definition) {
     if (!definition?.kind) throw new Error("mission node definition missing kind");
     DEFINITIONS.set(definition.kind, definition);
     return definition;
   }

   export function missionNodeDefinition(kind) {
     return DEFINITIONS.get(kind) || null;
   }

   export function listMissionNodeDefinitions() {
     return [...DEFINITIONS.values()];
   }
   ```

2. Add tests that the four existing data node kinds still return definitions:

   ```js
   expect(missionNodeDefinition("mock.generate")).toBeTruthy();
   ```

3. Convert the existing data node definition logic into registry entries first. Do not touch doctor/factory/autopilot yet.
4. Add a helper:

   ```js
   export function buildMissionNode(kind, context = {}) {
     const definition = missionNodeDefinition(kind);
     if (!definition) throw new Error(`unknown mission node kind: ${kind}`);
     const input = definition.buildInput ? definition.buildInput(context) : context.input || {};
     return {
       id: definition.id || kind,
       missionId: context.missionId,
       kind,
       label: definition.label || kind,
       status: context.status || "pending",
       runtimeKind: definition.runtimeKind || kind,
       input,
       dependsOn: definition.dependsOn ? definition.dependsOn(context) : [],
       artifacts: definition.artifacts ? definition.artifacts(input, context) : [],
       blockers: [],
     };
   }
   ```

5. In `mission-plan.mjs`, replace one node at a time:
   - first `mock.generate`
   - then `snowfakery.generate`
   - then `simulator.seed`
   - then `simulator.validate`
6. After each replacement, run:

   ```bash
   bun test tools/lib/mission-plan.test.mjs
   ```

7. Only when data nodes are stable, add definitions for:
   - `preflight.doctor`
   - `antigravity.spec-data-review`
   - `factory.build`
   - `autopilot.converge`
8. Keep exact node IDs. If a test snapshot changes IDs, revert that part.

**Small-model dry-run clarifications:**

- Split Agent B into two commits:
  - B1: registry storage, definition listing, and data-node definitions only. Do not change `buildMissionGraph()` in B1.
  - B2: refactor `buildMissionGraph()` one node at a time to call registry helpers.
- In B1, every definition must include all of these fields or functions: `kind`, `runtimeKind`, `label`, `buildInput`, `artifacts`, `dependsOn`, `safeToRun`, `validateArtifacts`, `presentation`.
- For B1, `presentation` can be a no-op function such as `presentation: () => ({})`. Do not invent console presentation semantics here.
- Do not modify command argv construction while adding the registry. Copy existing argv construction exactly from `mission-nodes.mjs` / `mission-plan.mjs`.
- Add a test that captures exact node ID order from `buildMissionGraph({ scenario: "x", systems: ["workday"] })` before and after B2. The IDs must remain unchanged.
- Add a dependency test that verifies `mock.generate -> snowfakery.generate -> simulator.seed -> simulator.validate`.
- If a test fails after replacing a node, revert only that node replacement and keep the registry definition if its standalone tests pass.

**Minimum tests to write:**

- every registered definition has `kind`, `runtimeKind`, and `label`
- `buildMissionGraph({ scenario: "x", systems: ["workday"] })` contains the same node IDs in the same order as before
- data node dependencies remain `mock.generate -> snowfakery.generate -> simulator.seed -> simulator.validate`

**Acceptance criteria:**

- `buildMissionGraph()` no longer embeds command arrays or artifact arrays for data nodes.
- Adding a new node kind requires a registry entry rather than daemon + console + planner edits.
- Existing mission tests pass without graph-shape regressions.

**Verification:**

```bash
bun test tools/lib/mission-plan.test.mjs tools/lib/mission-node-registry.test.mjs
```

### Agent C: Shared Utility Extraction

**Goal:** Remove repeated low-level helpers that make later refactors noisy.

**Branch name:**

```bash
git checkout -b refactor/c-shared-utilities
```

**Primary files:**

- `tools/lib/factory-core.mjs`
- `apps/factory/scripts/factory.mjs`
- `apps/factory/scripts/plan-mock-data.mjs`

**Add:**

- `tools/lib/json-io.mjs`
- `tools/lib/cli-args.mjs`
- `tools/lib/naming.mjs`
- tests for each module.

**Important result from small-model dry run:**

A low-capability model is likely to make two bad edits if this task is too broad:

- It may start with `factory-core.mjs` because the helpers look simple. Do not do that first. `factory-core.mjs` exports `readJson()` and `writeJson()` and is consumed by CLI/MCP/console surfaces.
- It may replace `factory.mjs` argument parsing with a generic parser that returns a different shape. Do not do that first. `factory.mjs` currently expects `{ command, flags }` and uses string `"true"` for bare flags.

Therefore Agent C is split into C1, C2, and C3. Execute them as separate commits or separate agents.

**Steps:**

1. C1: add JSON IO helpers and migrate only `plan-mock-data.mjs`.
2. C2: add CLI arg helpers with separate return-shape functions; migrate one low-risk call site.
3. C3: audit naming helpers; do not create a competing naming module until the existing `factory/core/naming.mjs` ownership is decided.
4. Do not refactor business logic in any C subtask.

**Detailed implementation recipe:**

#### C1: JSON IO Only

**C1 write set:**

- `tools/lib/json-io.mjs`
- `tools/lib/json-io.test.mjs`
- `apps/factory/scripts/plan-mock-data.mjs`

Do not edit `factory.mjs`, `factory-core.mjs`, `cli-args.mjs`, or `naming.mjs` in C1.

1. Add `tools/lib/json-io.mjs` with sync helpers only:

   ```js
   import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
   import { dirname } from "node:path";

   export function readJson(path, fallback = null) {
     if (!path || !existsSync(path)) return fallback;
     try { return JSON.parse(readFileSync(path, "utf8")); }
     catch { return fallback; }
   }

   export function writeJson(path, value) {
     mkdirSync(dirname(path), { recursive: true });
     writeFileSync(path, JSON.stringify(value, null, 2) + "\n", "utf8");
   }
   ```

2. It is acceptable for existing async callers to keep `await readJson(...)` or `await writeJson(...)` even though these helpers return synchronously. Do not rewrite callers just to remove `await`.
3. In `apps/factory/scripts/plan-mock-data.mjs`, replace only local `readJson()` and `writeJson()` with:

   ```js
   import { readJson, writeJson } from "../../../tools/lib/json-io.mjs";
   ```

4. Leave `writeText()` local in `plan-mock-data.mjs`.
5. After replacing JSON helpers in `plan-mock-data.mjs`, update imports carefully:
   - remove unused `readFile`
   - remove unused `writeFile`
   - remove unused `mkdir`
   - remove unused `existsSync`
   - keep `dirname` if `writeText()` still uses it
6. Run C1 verification before doing anything else:

   ```bash
   bun test tools/lib/json-io.test.mjs apps/factory/scripts/plan-mock-data.test.mjs
   node --check apps/factory/scripts/plan-mock-data.mjs
   ```

#### C2: CLI Args Only

Start C2 only after C1 is committed.

**C2 write set:**

- `tools/lib/cli-args.mjs`
- `tools/lib/cli-args.test.mjs`
- one selected low-risk call site

Do not migrate `factory.mjs` in the first C2 commit.

Add `cli-args.mjs` with separate helpers for different existing parser shapes:

   ```js
   export function parseFlagArgs(argv = [], { bareValue = "true" } = {}) {
     const flags = {};
     const positional = [];
     for (let i = 0; i < argv.length; i += 1) {
       const item = argv[i];
       if (!item.startsWith("--")) {
         positional.push(item);
         continue;
       }
       const key = item.slice(2);
       const next = argv[i + 1];
       if (!next || next.startsWith("--")) flags[key] = bareValue;
       else {
         flags[key] = next;
         i += 1;
       }
     }
     return { positional, flags };
   }

   export function parseCommandArgs(argv = [], defaultCommand = "help", options = {}) {
     const { positional, flags } = parseFlagArgs(argv, options);
     return { command: positional[0] || defaultCommand, flags };
   }

   export function boolFlag(flags, key, fallback = false) {
     if (!(key in flags)) return fallback;
     const value = flags[key];
     if (value === true) return true;
     if (value === false) return false;
     return !["0", "false", "no", "off"].includes(String(value).toLowerCase());
   }
   ```

Rules:

- Preserve existing flag value semantics for migrated call sites.
- If the old parser uses string `"true"` for bare flags, call `parseFlagArgs(argv, { bareValue: "true" })` or `parseCommandArgs(argv, "help", { bareValue: "true" })`.
- Do not substitute `parseFlagArgs()` directly into a call site that expects `{ command, flags }`.
- Do not substitute `parseCommandArgs()` directly into a call site that expects only `flags`.

#### C3: Naming Audit Only

Start C3 only after C1 and C2 are committed.

Do not immediately create `tools/lib/naming.mjs`.

First inspect:

- `apps/factory/scripts/factory/core/naming.mjs`
- `apps/factory/scripts/factory.mjs`
- any existing imports of `snakeCase`, `safePyName`, `canonicalSystemId`, `validPythonIdentifierName`

Then decide one of these paths:

- promote the existing `factory/core/naming.mjs` helpers into `tools/lib/naming.mjs` and re-export from the old path for compatibility, or
- keep `factory/core/naming.mjs` as the owner and do not add a competing `tools/lib/naming.mjs`.

Do not move `safeAgentsCliProjectName()` in this task. It is deployment-specific, not a generic naming utility.

**Minimum tests to write:**

- `readJson` returns fallback for missing file and invalid JSON
- `writeJson` creates parent directories
- `parseFlagArgs(["cmd", "--id", "x", "--force"], { bareValue: "true" })` returns positional `["cmd"]` and flags `{ id: "x", force: "true" }`
- `parseCommandArgs(["schema", "--dir", "x"], "help", { bareValue: "true" })` returns `{ command: "schema", flags: { dir: "x" } }`
- `boolFlag` handles `"false"`, `"0"`, `"true"`, `true`, and fallback
- naming tests are added only after C3 chooses the naming owner

**Acceptance criteria:**

- No public behavior change.
- `factory help` still works.
- Existing tests pass.
- New shared modules have direct tests.

**Verification:**

```bash
bun test tools/lib/json-io.test.mjs tools/lib/cli-args.test.mjs
node --check apps/factory/scripts/factory.mjs
node --check apps/factory/scripts/plan-mock-data.mjs
```

## Batch 2: Interplay Layer

Start after Agent B has stable registry APIs.

### Agent D: Data Realization Contract

**Goal:** Make scenario graph, Snowfakery, simulator seed materialization, and simulator validation one typed lifecycle.

**Branch name:**

```bash
git checkout -b refactor/d-data-realization-contract
```

**Primary files:**

- `apps/factory/src/simulator-sdk.js`
- `tools/lib/mission-nodes.mjs`
- `tools/lib/mission-node-registry.mjs`
- `apps/factory/scripts/plan-mock-data.mjs`
- `apps/factory/scripts/materialize-simulator-seeds.mjs`
- `apps/factory/scripts/validate-simulator-pack.mjs`

**Add:**

- `tools/lib/data-realization-contract.mjs`
- `tools/lib/data-realization-contract.test.mjs`

**Steps:**

1. Add `buildDataRealizationPlan(context)`.
2. Add `dataRealizationArtifacts(plan)`.
3. Add `dataRealizationMissionNodes(plan)`.
4. Add `validateDataRealizationArtifacts(kind, options)`.
5. Move command and artifact construction for:
   - `mock.generate`
   - `snowfakery.generate`
   - `simulator.seed`
   - `simulator.validate`
6. Make simulator SDK and mission graph call this contract instead of duplicating command arrays.
7. Ensure requested systems, workspace path, source map, and scenario are carried through all nodes.

**Detailed implementation recipe:**

1. Read these functions before editing:

   ```bash
   rg -n "dataMissionNodes|missionDataContext|snowfakery|materialize|validate-simulator" tools/lib apps/factory/src apps/factory/scripts
   ```

2. Create `tools/lib/data-realization-contract.mjs` with a simple plan shape first:

   ```js
   import { join } from "node:path";

   export function buildDataRealizationPlan({
     scenario = "scenario",
     workspace = null,
     systems = [],
     sourceMap = "apps/factory/src/use-case-source-map.generated.json",
   } = {}) {
     const resolvedWorkspace = workspace || join(".ge-missions", scenario);
     const requestedSystems = Array.isArray(systems) ? systems.filter(Boolean) : [];
     return {
       scenario,
       workspace: resolvedWorkspace,
       sourceMap,
       systems: requestedSystems,
       paths: {
         dataPlan: join(resolvedWorkspace, "mock_data/plan/data-plan.json"),
         scenarioGraph: join(resolvedWorkspace, "mock_data/scenario/scenario-graph.json"),
         snowfakeryRecipe: join(resolvedWorkspace, "mock_data/snowfakery/structured.recipe.yml"),
         snowfakeryOutput: join(resolvedWorkspace, "mock_data/snowfakery/output"),
         snowfakeryRealizationPlan: join(resolvedWorkspace, "mock_data/snowfakery/realization-plan.json"),
         simulatorIndex: join(resolvedWorkspace, "mock_data/simulators/index.json"),
         simulatorSeedReport: join(resolvedWorkspace, "mock_data/simulators/materialization-report.json"),
       },
     };
   }
   ```

3. Add `dataRealizationCommands(plan)` returning command arrays:

   ```js
   export function dataRealizationCommands(plan) {
     return {
       mockGenerate: ["node", "apps/factory/scripts/plan-mock-data.mjs", "--dir", plan.workspace, "--usecase", plan.scenario, "--sourceMap", plan.sourceMap],
       snowfakeryGenerate: ["snowfakery", plan.paths.snowfakeryRecipe, "--output-format", "csv", "--output-folder", plan.paths.snowfakeryOutput],
       simulatorSeed: ["node", "apps/factory/scripts/materialize-simulator-seeds.mjs", "--dir", plan.workspace],
       simulatorValidate: ["node", "apps/factory/scripts/validate-simulator-pack.mjs", "--check", "true", ...(plan.systems[0] ? ["--system", plan.systems[0]] : [])],
     };
   }
   ```

4. Add `dataRealizationArtifacts(plan)` using the exact names already used by mission artifact validation:
   - `data_plan`
   - `scenario_graph`
   - `snowfakery_recipe`
   - `snowfakery_output`
   - `snowfakery_realization_plan`
   - `simulator_index`
   - `simulator_seed_report`
5. Add `dataRealizationMissionNodes(plan, { missionId })`.
6. Replace `missionDataContext()` and `dataMissionNodes()` internals with calls to this module, but keep their exported names as compatibility wrappers.
7. Update `simulator-sdk.js` to call `buildDataRealizationPlan()` and `dataRealizationCommands()` instead of building its own command arrays.
8. Do not edit `plan-mock-data.mjs`, `materialize-simulator-seeds.mjs`, or `validate-simulator-pack.mjs` unless a test proves an argument mismatch.

**Small-model dry-run clarifications:**

- Split Agent D into two commits:
  - D1: add `data-realization-contract.mjs` and tests only. Do not edit `mission-nodes.mjs`, `mission-plan.mjs`, or `simulator-sdk.js`.
  - D2: integrate the contract into `mission-nodes.mjs` and `simulator-sdk.js`.
- D1 tests must prove the new command arrays exactly match existing command arrays for a representative scenario. Preserve argv order exactly.
- Use the same workspace slug logic as the existing mission data code. Do not invent a new workspace path format.
- The Snowfakery output folder must remain exactly `mock_data/snowfakery/output`.
- The simulator validator command must preserve `--check true`.
- If multiple systems are provided, do not blindly append every system to one validator command. Preserve the current behavior: validate the selected/effective system, or use the first requested system only when that is the existing behavior.
- Treat `sourceMap` as a pass-through input. Do not generate or rewrite `apps/factory/src/use-case-source-map.generated.json`.

**Minimum tests to write:**

- default workspace is `.ge-missions/<scenario>`
- Snowfakery command uses `mock_data/snowfakery/structured.recipe.yml`
- simulator validate includes requested system when provided
- mission nodes preserve dependency order
- simulator SDK commands equal data realization commands for the same input

**Acceptance criteria:**

- The same plan powers simulator SDK and mission graph.
- No duplicate hard-coded Snowfakery/materializer/validator command arrays remain in planner and SDK.
- Tests cover workspace path correctness, requested systems, existing simulator lookup, and missing simulator behavior.

**Verification:**

```bash
bun test tools/lib/data-realization-contract.test.mjs tools/lib/mission-plan.test.mjs apps/factory/src/simulator-sdk.test.mjs
```

### Agent E: Console Presentation Contract

**Goal:** Make console render normalized backend state rather than infer runtime semantics in React.

**Branch name:**

```bash
git checkout -b refactor/e-console-presentation-contract
```

**Primary files:**

- `apps/console/src/views/Activity.tsx`
- `apps/console/src/views/Overview.tsx`
- `apps/console/src/services/geClient.ts`
- `tools/lib/runtime-contract.mjs`

**Steps:**

1. Add `presentation` to runtime task summaries through `runtimeTaskPresentation(task)`.
2. Include:
   - `title`
   - `subtitle`
   - `primaryAction`
   - `secondaryActions`
   - `statusTone`
   - `artifactSummary`
   - `blockerSummary`
3. Update Activity and Overview to prefer `task.presentation`.
4. Keep fallback rendering for older tasks and missing presentation.
5. Remove duplicated formatting logic only when a backend presentation field replaces it cleanly.

**Detailed implementation recipe:**

1. Wait until Agent A has merged `runtimeTaskPresentation()`.
2. In `geClient.ts`, add optional `presentation` to `RuntimeTaskSummary`. Do not remove existing fields.
3. In `Activity.tsx`, find helper functions that infer task text:

   ```bash
   rg -n "summarizeRuntimeTask|summarizeNode|formatRuntimeEvent|artifactStatusCounts|resumePlan|nextAction" apps/console/src/views/Activity.tsx
   ```

4. Replace only the top-level task title/subtitle/action with `task.presentation` first.
5. Keep node-level rendering unchanged in the first pass.
6. In `Overview.tsx`, replace custom recommended-action text with:

   ```ts
   const presentation = latestMission?.presentation;
   const recommendedTitle = presentation?.title || existingFallback;
   const recommendedSubtitle = presentation?.subtitle || existingFallback;
   ```

7. Do not change route names or navigation hashes.
8. If TypeScript complains because old tasks do not have `presentation`, make the field optional.

**Small-model dry-run clarifications:**

- Do not start Agent E until Agent A is merged. This task depends on the exact additive `presentation` contract.
- Scope the first pass to task-level presentation only in the Activity task list/card. Do not change mission node rendering in `MissionTaskDetails`, `MissionNodeRow`, node timelines, or DAG rendering.
- Use this fallback chain for task subtitles:

  ```ts
  task.presentation?.subtitle || summarizeRuntimeTask(task) || ""
  ```

- `presentation` must be optional in `RuntimeTaskSummary`; historical daemon tasks must still render.
- Before editing `Overview.tsx`, inspect whether it actually renders recommended/next-action text:

  ```bash
  rg "recommended|suggested|next action|nextAction" apps/console/src/views/Overview.tsx
  ```

- If no Overview recommended-action rendering exists, skip the Overview edit and report that it was not applicable.
- Do not add route, hash, navigation, API endpoint, or mission-node presentation changes in this agent.

**Minimum tests/checks:**

- `bun --cwd apps/console run lint`
- `bun --cwd apps/console run build`
- Manually search that fallback text still exists for old tasks:

  ```bash
  rg "existingFallback|presentation" apps/console/src/views
  ```

**Acceptance criteria:**

- New mission node kinds can appear in Activity without React code changes for basic display.
- Blocked tasks show exact reason and next action from backend.
- Overview recommendation uses backend action semantics.

**Verification:**

```bash
bun --cwd apps/console run lint
bun --cwd apps/console run build
```

## Batch 3: God Class Splits

Start after shared utilities land. These are extraction tasks; they should not change user-facing behavior.

### Agent F: `factory` Pipeline Split

**Goal:** Shrink `factory.mjs` by moving cohesive responsibilities into modules.

**Branch name:**

```bash
git checkout -b refactor/f-factory-split
```

**Primary file:**

- `apps/factory/scripts/factory.mjs`

**Add modules:**

- `apps/factory/scripts/factory/core/pipeline-state.mjs`
- `apps/factory/scripts/factory/data/schema-generation.mjs`
- `apps/factory/scripts/factory/evals/renderers.mjs`
- `apps/factory/scripts/factory/harness/review-refine.mjs`
- `apps/factory/scripts/factory/deploy/release-commands.mjs`

**Steps:**

1. Extract pipeline file/path helpers, `loadPipeline`, `savePipeline`, `markStep`, and `requireStep`.
2. Extract schema derivation and table/column generation logic.
3. Extract golden eval and eval config rendering.
4. Extract harness review/refine execution and feedback application.
5. Extract deploy/register/publish helper functions only after earlier extractions are stable.
6. Keep `factory.mjs` as CLI command dispatch plus thin command handlers.

**Detailed implementation recipe:**

Do this as multiple small commits. Do not attempt all extractions in one pass.

**Commit F1: pipeline state extraction only**

1. In `factory.mjs`, locate:
   - `pipelinePath`
   - `schemaPath`
   - `fixturesDir`
   - `manifestPath`
   - `cloudDataDir`
   - `deployPlanPath`
   - `loadPipeline`
   - `savePipeline`
   - `markStep`
   - `requireStep`
2. Copy those functions into `scripts/factory/core/pipeline-state.mjs`.
3. Export them by name.
4. Import them back into `factory.mjs`.
5. Delete the local definitions only after `node --check` passes.

Run:

```bash
node --check apps/factory/scripts/factory.mjs
```

**Commit F2: schema generation extraction**

1. Locate:
   - `classifyColumn`
   - `classifyTable`
   - `systemKindFromConnection`
   - `buildUseCaseSpec`
   - `deriveColumnsForEntity`
   - `deriveSchemaFromUseCase`
   - `generateValue`
   - `toCsv`
2. Move them into `scripts/factory/data/schema-generation.mjs`.
3. Keep any file-writing behavior in `factory.mjs` unless the whole function is pure.
4. Add tests for `deriveSchemaFromUseCase` using a tiny fake use case.

**Commit F3: eval rendering extraction**

1. Locate:
   - `renderGoldenEvals`
   - `renderAgentsCliEvalSet`
   - `renderEvalConfig`
   - `renderOptimizationConfig`
2. Move them into `scripts/factory/evals/renderers.mjs`.
3. Add a test that the returned eval set contains expected tool calls from a fake contract.

**Commit F4: harness review/refine extraction**

1. Locate:
   - `readWorkspaceReviewContext`
   - `cmdHarnessReview`
   - `applyHarnessReviewFeedback`
   - `cmdHarnessRefine`
2. Move helper logic into `scripts/factory/harness/review-refine.mjs`.
3. Keep CLI command wrappers in `factory.mjs`.

**Commit F5: deploy helper extraction, gated later**

Do not extract deploy/register/publish helpers in F1-F4. Only attempt `deploy/release-commands.mjs` after F1-F4 are merged and stable. If any deploy helper depends on mutable CLI state, leave it in `factory.mjs`.

**Small-model dry-run clarifications:**

- F1 is the only required first task. It must create `apps/factory/scripts/factory/core/pipeline-state.mjs` and move only:
  - `pipelinePath`
  - `schemaPath`
  - `fixturesDir`
  - `manifestPath`
  - `cloudDataDir`
  - `deployPlanPath`
  - `loadPipeline`
  - `savePipeline`
  - `markStep`
  - `requireStep`
- Extract dependency roots before functions that call them. Path helpers move before pipeline readers/writers.
- Preserve command output shape exactly. JSON command output must keep the same top-level fields such as `ok`, `step`, paths, manifests, and diagnostics.
- Do not change `ok(data)` or error response formatting while extracting modules.
- Do not convert command handlers to a new framework. Keep `factory.mjs` as the CLI dispatch file.

**Do not change:**

- command names
- flag names
- output JSON top-level shape
- generated workspace directory layout

**Acceptance criteria:**

- `factory.mjs` drops by at least 800 lines.
- Command names and flags remain stable.
- Existing generated output remains equivalent for representative fixtures.

**Verification:**

```bash
node --check apps/factory/scripts/factory.mjs
bun test apps/factory/scripts/plan-mock-data.test.mjs
```

### Agent G: Runtime Daemon Split

**Goal:** Separate daemon store, HTTP routing, execution, resume, and event streaming.

**Branch name:**

```bash
git checkout -b refactor/g-runtime-daemon-split
```

**Primary file:**

- `tools/lib/runtime-daemon.mjs`

**Add modules:**

- `tools/lib/runtime-store.mjs`
- `tools/lib/runtime-executors.mjs`
- `tools/lib/runtime-resume.mjs`
- `tools/lib/runtime-http.mjs`
- `tools/lib/runtime-events.mjs`

**Steps:**

1. Extract file-backed run storage to `runtime-store.mjs`.
2. Extract SSE/event utilities to `runtime-events.mjs`.
3. Extract task executors to `runtime-executors.mjs`.
4. Extract resume decisions and child task scheduling to `runtime-resume.mjs`.
5. Extract HTTP route handlers to `runtime-http.mjs`.
6. Keep `runtime-daemon.mjs` as the composition entrypoint.

**Detailed implementation recipe:**

Do the split in this order.

**Commit G1: store extraction**

Move only these functions/constants into `runtime-store.mjs`:

- `ensureStore`
- `readJson`
- `writeJson`
- `runDir`
- `runMetaPath`
- `runEventsPath`
- `createRun`
- `updateRun`
- `updateRunOutput`
- `listRuns`
- `listRunSummaries`
- `taskSummary`
- `taskDetail`

Before moving `taskSummary`, run:

```bash
rg "function taskSummary|resumePlanFor|taskSummary =" tools/lib/runtime-daemon.mjs
```

If `taskSummary` calls `resumePlanFor`, leave `taskSummary` and `taskDetail` in `runtime-daemon.mjs` until Agent A/G4 extracts resume logic. Do not put `resumePlanFor` in `runtime-store.mjs`.

**Commit G2: event extraction**

Move:

- `appendEvent`
- `listEvents`
- `listSequencedEvents`
- `streamRunEvents`

**Commit G3: executor extraction**

Move task starters only:

- `startGeCommandTask`
- `startProcessCommandTask`
- `startMissionNodeCommandTask`
- `startDoctorTask`
- `startAutopilotTask`
- `startMissionTask`

Keep command safety helpers with executors unless Agent A/C already moved them.

**Commit G4: resume extraction**

Move:

- `resumePlanFor`
- `resumeTask`
- `resumeGeCommandTask`
- `resumeProcessCommandTask`
- `resumeAutopilotTask`
- `resumeMissionTask`

This commit is blocked until Agent A's runtime contract is merged. Resume planning belongs in `runtime-resume.mjs`, not in store or HTTP modules.

**Commit G5: HTTP extraction**

Move request routing last. This is highest risk. Keep `startDaemonServer()` signature unchanged.

Add an HTTP test after this step that verifies `POST /api/tasks` returns `202` and a task id.

**Rule:** after each step run:

```bash
bun test tools/lib/runtime-daemon.test.mjs
node --check tools/lib/runtime-daemon.mjs
```

**Acceptance criteria:**

- Daemon API paths unchanged.
- Existing task files remain readable.
- Resume behavior unchanged.
- Tests pass against both old and new task shapes.

**Verification:**

```bash
bun test tools/lib/runtime-daemon.test.mjs tools/lib/runtime-contract.test.mjs
bun tools/ge.mjs daemon status
```

### Agent H: Factory Core Split

**Goal:** Make `factory-core.mjs` a compatibility facade over smaller plane modules.

**Branch name:**

```bash
git checkout -b refactor/h-factory-core-split
```

**Primary file:**

- `tools/lib/factory-core.mjs`

**Add modules:**

- `tools/lib/factory-catalog.mjs`
- `tools/lib/factory-workspaces.mjs`
- `tools/lib/factory-local.mjs`
- `tools/lib/factory-release.mjs`
- `tools/lib/factory-status.mjs`

**Steps:**

1. Move catalog loading and use-case listing to `factory-catalog.mjs`.
2. Move local workspace doctor/repair/status helpers to `factory-workspaces.mjs`.
3. Move local harness setup/provisioning to `factory-local.mjs`.
4. Move cloud ship/sync/cutover/release helpers to `factory-release.mjs`.
5. Move status board composition to `factory-status.mjs`.
6. Re-export compatible functions from `factory-core.mjs`.

**Detailed implementation recipe:**

Do not start by moving `loadConfig`, `run`, or shared constants. Those are dependency roots. Start with leaf functions.

**Commit H1: catalog module**

Move:

- `loadCatalog`
- `toAgent`
- `listUsecases`

Add `tools/lib/factory-catalog.test.mjs` that checks a filtered catalog returns stable shape.

Use explicit imports and re-exports in `factory-core.mjs`; do not use `export *`:

```js
import { loadCatalog, toAgent, listUsecases } from "./factory-catalog.mjs";

export { loadCatalog, toAgent, listUsecases };
```

**Commit H2: workspace module**

Move:

- `resolveLocalWorkspaceId`
- `localWorkspaceExists`
- `missingWorkspaceReport`
- `workspaceDoctor`
- `workspaceRepair`

Keep exported names re-exported from `factory-core.mjs`.

When moving workspace functions, make dependencies explicit. If a function uses `GEN_DIR`, `LOCAL_PROJECTS`, or `run()`, import or pass that dependency. Do not rely on globals that no longer exist after extraction.

**Commit H3: local module**

Move:

- `harnessVenvPython`
- `ensureHarnessVenv`
- `ensureLocalUv`
- `localPreflight`
- `provisionLocal`
- `copyWorkspaces`
- `syncLocal`

**Commit H4: release module**

Move:

- `ship`
- `sync`
- `cutover`
- cloud release helpers used only by those functions.

**Commit H5: status module**

Move:

- `status`
- `fleetStatus`
- `statusBoard`

Make status dependencies explicit. If status functions call `gcloud`, `factoryPlane`, or config helpers, import or pass them rather than assuming they are still module globals.

**Public API that must remain importable from `factory-core.mjs`:**

- `loadCatalog`
- `listUsecases`
- `toAgent`
- `workspaceDoctor`
- `workspaceRepair`
- `provisionLocal`
- `ensureLocalUv`
- `ensureHarnessVenv`
- `ship`
- `sync`
- `status`
- `fleetStatus`
- `statusBoard`

Also preserve any other existing named exports from `factory-core.mjs` unless a test and reviewer explicitly approve a removal.

**Do not change:**

- CLI import path from `tools/ge.mjs`
- MCP server import path
- `.ge.json` config format
- Terraform command behavior

**Acceptance criteria:**

- Existing imports from `factory-core.mjs` still work.
- CLI and MCP server do not need broad rewrites.
- Each new module has focused tests.

**Verification:**

```bash
bun test tools/lib/factory-*.test.mjs
node --check tools/ge.mjs
```

## Batch 4: Spec Intake And Hygiene

These can run after the core contracts are stable.

### Agent I: Spec Intake Contract

**Goal:** Make interview, normalized spec, golden evals, simulator intent, and mission graph one durable intake flow.

**Branch name:**

```bash
git checkout -b refactor/i-spec-intake-contract
```

**Primary files:**

- `apps/factory/src/spec-workbench.js`
- `apps/factory/src/simulator-sdk.js`
- `skills/interviewing-specs/SKILL.md`
- `skills/planning-missions/SKILL.md`

**Add:**

- `apps/factory/src/spec-intake-contract.js`
- `apps/factory/src/spec-intake-contract.test.mjs`

**Steps:**

1. Define `SpecIntake` shape:
   - `interviewId`
   - `spec`
   - `goldenEvals`
   - `simulatorIntent`
   - `deploymentIntent`
   - `readiness`
2. Add normalizers for harness-authored specs.
3. Make golden eval validation return a `SpecIntake`-compatible result.
4. Make simulator SDK accept `SpecIntake`.
5. Update skills to point harnesses at this contract.

**Detailed implementation recipe:**

1. Read `apps/factory/src/spec-workbench.js` first. Do not edit skills yet.
2. Create `apps/factory/src/spec-intake-contract.js` with pure functions only.
3. Add this initial shape:

   ```js
   export function normalizeSpecIntake(input = {}) {
     const spec = input.spec || input.generationSpec || input.agentSpec || {};
     const goldenEvals = input.goldenEvals || spec?.generationSpec?.behaviorContract?.goldenEvals || [];
     const simulatorIntent = input.simulatorIntent || {};
     return {
       kind: "ge.spec-intake",
       version: 1,
       interviewId: input.interviewId || spec.interviewId || null,
       spec,
       goldenEvals,
       simulatorIntent,
       deploymentIntent: input.deploymentIntent || {},
       readiness: specIntakeReadiness({ spec, goldenEvals, simulatorIntent }),
     };
   }

   export function specIntakeReadiness({ spec = {}, goldenEvals = [], simulatorIntent = {} } = {}) {
     const blockers = [];
     if (!spec.id && !spec.generationSpec?.id) blockers.push({ id: "spec_id_missing", message: "spec is missing id" });
     if (!goldenEvals.length) blockers.push({ id: "golden_evals_missing", message: "golden evals are missing" });
     if (!simulatorIntent.id && !simulatorIntent.systems?.length) blockers.push({ id: "simulator_intent_missing", message: "simulator intent is missing" });
     return { ok: blockers.length === 0, blockers };
   }
   ```

4. Add tests for:
   - complete intake is ready
   - missing evals creates blocker
   - missing simulator intent creates blocker
5. Update `spec-workbench.js` so `applyGoldenEvalsToSpec()` can return or attach a normalized intake result without changing existing return fields.
6. Update `simulator-sdk.js` to accept either the old `{ spec, simulator }` input or `{ specIntake }`.
7. Only after tests pass, update skill docs to say the harness should produce `ge.spec-intake`.

**Small-model dry-run clarifications:**

- Do not edit `skills/interviewing-specs/SKILL.md` or `skills/planning-missions/SKILL.md` until `spec-intake-contract.js` tests pass.
- Use `snake_case` blocker IDs, not hyphenated IDs. Align with existing readiness codes such as `golden_evals_missing`.
- `normalizeSpecIntake()` must detect golden evals from both nested and flat locations. Add tests for at least:
  - `input.goldenEvals`
  - `input.spec.generationSpec.behaviorContract.goldenEvals`
  - `input.spec.behaviorContract.goldenEvals` if that shape exists in fixtures
- Do not import daemon, runtime, factory, or mission modules into `spec-intake-contract.js`; it must remain a pure leaf module to avoid cycles.
- Update `simulator-sdk.js` additively:
  - if `input.specIntake` exists, read simulator intent from it
  - otherwise use the existing `simulatorSdkPlan()` path unchanged
- Do not rewrite `simulatorSdkPlan()` as part of this task.

**Do not change:**

- existing registered use-case spec format
- existing golden eval JSON shape
- existing simulator SDK CLI flags

**Acceptance criteria:**

- A harness interview can produce one object that flows into mission planning.
- Freeform generation remains possible but is clearly marked draft/non-durable.
- Golden eval and simulator readiness are visible before generation.

**Verification:**

```bash
bun test apps/factory/src/spec-workbench.test.mjs apps/factory/src/spec-intake-contract.test.mjs
```

### Agent J: Source Hygiene Hardening

**Goal:** Prevent generated/runtime/cache files from becoming source debt.

**Branch name:**

```bash
git checkout -b refactor/j-source-hygiene-hardening
```

**Primary files:**

- `tools/lib/source-hygiene.mjs`
- `tools/lib/source-hygiene.test.mjs`
- `.gitignore`

**Steps:**

1. Add hygiene rules for:
   - `.ge-harness`
   - `artifacts`
   - `__pycache__`
   - runtime daemon output
   - generated OpenAPI caches
   - generated registry files without producer metadata
2. Do not delete user files in this task.
3. Add tests for blocked paths and approved generated-source exceptions.
4. Add a clear remediation message for each class of hygiene failure.

**Detailed implementation recipe:**

1. Open `tools/lib/source-hygiene.mjs` and `tools/lib/source-hygiene.test.mjs`.
2. Check `.gitignore` before editing it:

   ```bash
   rg "^\\.ge-harness/|^artifacts/|__pycache__|_openapi|\\.ge-daemon/" .gitignore
   ```

3. Do not delete any files.
4. Add a blocked path table. Use plain prefix/pattern checks:

   ```js
   const BLOCKED_RUNTIME_PATHS = [
     { pattern: /^\.ge-harness\//, reason: "runtime harness output belongs outside source" },
     { pattern: /^artifacts\//, reason: "runtime artifacts belong in ignored run output" },
     { pattern: /__pycache__\//, reason: "python bytecode is generated cache" },
     { pattern: /^\.ge-daemon\//, reason: "daemon state is runtime output" },
   ];
   ```

5. If the existing module has a different structure, adapt this table to its style rather than replacing the whole file.
6. Add one test per blocked path.
7. Add one allowed test for intentional generated source files already allowed today.
8. Update `.gitignore` only for paths that are definitely runtime/cache and not already ignored:
   - `.ge-harness/`
   - `artifacts/`
   - `**/__pycache__/`
9. Do not ignore source directories or simulator definitions.

**Small-model dry-run clarifications:**

- Do not run cleanup commands, do not delete files, and do not use `git rm --cached`.
- Add blocked patterns/tests only. Use the existing `source-hygiene.mjs` shape and `formatHygieneReport()` style; do not invent a separate remediation system.
- Define producer metadata before enforcing generated-source metadata. The preferred header shape is:

  ```js
  // GENERATED BY: <command> -- do not edit manually
  ```

- Do not block existing allowed generated sources until there is a migration path for adding producer metadata.
- If current dirty workspace already contains `.ge-harness/`, `artifacts/`, `__pycache__/`, or OpenAPI cache files, report exact paths in the final response. Do not clean them.

**Minimum tests to write:**

- `.ge-harness/run.json` is blocked
- `artifacts/foo.json` is blocked
- `apps/factory/scripts/__pycache__/x.pyc` is blocked
- existing `apps/factory/src/use-cases.generated.js` remains allowed
- documented generated registries are still allowed when the existing hygiene policy allows them

**Failure handling:**

If a hygiene test fails because the current dirty workspace already has these files, do not remove them. Report the failure and include exact paths.

**Acceptance criteria:**

- Accidental runtime/cache files fail source hygiene tests.
- Intentional generated registries remain allowed with documented producer commands.
- Test output tells the user where the file should live instead.

**Verification:**

```bash
bun test tools/lib/source-hygiene.test.mjs
git status --short
```

## Merge Order

1. Agent C: shared utilities.
2. Agent A: runtime contract.
3. Agent B: mission node registry.
4. Agent D: data realization contract.
5. Agent E: console presentation contract.
6. Agent F: `factory` split.
7. Agent G: runtime daemon split.
8. Agent H: factory core split.
9. Agent I: spec intake contract.
10. Agent J: source hygiene hardening.

## Cross-Agent Coordination Points

- Agent D must wait for Agent B registry shape.
- Agent E must wait for Agent A runtime contract shape.
- Agent G must wait for Agent A contract extraction.
- Agent F benefits from Agent C utilities but can start with pipeline-state extraction if needed.
- Agent I should wait until Agent D stabilizes simulator/data lifecycle inputs.
- Agent J can run anytime but should commit late to avoid blocking active generated files from other branches.

## Per-Agent Final Response Template

Each agent should finish with this exact structure:

```md
Changed:
- <file>: <what changed>

Tests:
- <command>: pass
- <command>: skipped, <reason>

Compatibility:
- Public commands changed: no
- JSON/API shape changed: no, or list exact additive fields

Follow-ups:
- <only real blockers or next tasks>
```

## Common Failure Modes And Fixes

- **Import cycle after extraction:** Move only pure helpers first. If module A imports module B and B imports A, put the shared helper in a third module.
- **Tests fail because timestamps changed:** Do not assert exact timestamps. Assert field exists or matches ISO-like string.
- **Command argv changed:** Restore exact old argv order. Mission/runtime safety checks often compare command shape.
- **Console TypeScript fails on optional fields:** Mark new backend fields optional in `geClient.ts` and keep fallback rendering.
- **Generated file appears in diff:** Unstage it with `git restore --staged <file>`. Do not delete it unless explicitly assigned.
- **Large diff in god-class split:** Stop and split into smaller commits. First commit should only extract one function family.
- **Runtime task old files fail normalization:** Make normalizers tolerant; do not migrate historical files as part of the contract extraction.

## Definition Of Done

- Public CLI commands still work.
- Mission graph still runs and resumes.
- Console builds and renders historical runtime tasks.
- Simulator SDK and mission graph share the same data realization contract.
- New node kinds can be added through registry/config rather than daemon + console + CLI + simulator SDK edits.
- `factory.mjs`, `runtime-daemon.mjs`, and `factory-core.mjs` are smaller compatibility surfaces instead of god classes.
- Source hygiene prevents runtime/generated clutter from silently becoming source.
