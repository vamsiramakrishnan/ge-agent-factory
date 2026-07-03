# `apps/factory/scripts/factory/`

Focused modules extracted this session out of `factory.mjs`, which had grown
to roughly 4,800 lines of a single command-orchestration + generation file.
The extractions are (with rare noted exceptions) verbatim moves — pure
functions of already-loaded inputs, with byte-identical output to the former
inline code — split out so each concern can be read, tested, and changed
without wading through the whole god-file. `factory.mjs` and the sibling
top-level files in this directory (`agent-workflow.mjs`, `registry.mjs`,
`scenario-graph.mjs`) still own orchestration/I/O and inject shared
dependencies (like `buildAgentQualityPlan`) into these modules rather than the
modules importing back up — that's intentional, it's what keeps this a
one-way dependency graph instead of a cycle.

Directory list below is exhaustive as of this writing (verified against `ls`).

## `use-case/`

Turns a raw use-case (systems, architecture connections, KPIs, or an explicit
`generationSpec`) into a concrete schema: source tables, entities, and
columns. `schema-derivation.mjs` is the legacy heuristic path (pattern-matches
known systems like Workday/SAP/Salesforce to canned table/entity shapes);
`schema-from-generation-spec.mjs` is the newer explicit-spec path; both funnel
through `entity-column-schemas.mjs` for per-entity column values. Split out
because schema derivation is a large, self-contained decision tree that
doesn't need to sit next to command dispatch.

## `runtime/`

Generated-workspace runtime plumbing: `agents-cli-metadata.mjs` reconciles
`pyproject.toml` / `agents-cli-manifest.yaml` / `.agent_engine_config.json`
for a generated agent's deploy path; `tools-backend.mjs` renders the
fixtures-vs-MCP backend switch generated agents use at import time
(`GE_DATA_BACKEND=fixtures|mcp`). Grouped together because both are about how
a generated agent *runs*, as opposed to what gets rendered into its source.

## `agents/`

Agent-level generation: `agent-workflow-derivation.mjs` turns a pipeline
narrative or explicit workflow into a single/sequential/parallel agent
topology (and builds the shared governance/guardrail preambles every
sub-agent instruction carries); `render-agent-py.mjs` assembles the actual
`app/agent.py` source from that topology plus the quality plan;
`okf-artifacts.mjs` writes the OKF knowledge-bundle and coverage sidecars into
the generated workspace. Split out as "the agent object itself and its
narrative," distinct from the tools it calls (`tools/`) or the contracts it's
built from (`core/`, `baseline/`).

## `okf/`

Just `markdown.mjs` — small, pure Markdown-rendering helpers (tables, bullet
lists, body-line joining) used by the OKF bundle builder
(`scripts/spec-to-okf.mjs`). Split out because it's generic string rendering
with no factory-specific logic, reusable anywhere OKF Markdown is emitted.

## `projections/`

`simulator-projections.mjs` projects the scenario graph (concepts/nodes) into
per-simulator collection mappings — i.e. it decides how abstract scenario
concepts materialize into a specific simulator's data collections. Has its
own test file (`simulator-projections.test.mjs`), unlike most of this
directory — likely split out partly *because* this logic was judged complex
enough to warrant direct unit tests rather than only integration coverage.

## `integration/`

Just `source-integration.mjs` — MCP service/API integration metadata per
datastore kind (AlloyDB, Firestore, Bigtable, BigQuery, GCS, Vertex AI, ...):
required GCP APIs, the ADK tool pattern to use, and MCP registry policy. Pulled
out because it's a static lookup table + resolution logic distinct from the
generation pipeline that consumes it.

## `baseline/`

Heuristics for synthesizing a plausible spec baseline when a use case doesn't
fully specify one: `systems.mjs` (system name → protocol/entities/datastore
lookup tables), `columns.mjs` (entity name → column heuristics), `spec.mjs`
(orchestrates the two into a full `generateSpec(useCase)`), and
`behavior-contract.mjs` (synthesizes the behavior contract — action verbs,
documents, escalation rules — from that spec). Grouped as "the fallback
content generator," separate from `use-case/`'s schema derivation, because
this produces plausible *values*, not structural derivation from an existing
spec.

## `simulators/`

`registry.mjs` loads and indexes the simulator-systems registry (schema, tool
catalog, projection/materialization/workflow catalogs per simulator) and
matches a source-system name to a simulator, including variant-matching rules
for cases like SAP S/4HANA FI vs. MM. The nested `scaffold/` subdirectory
(`fields.mjs`, `naming.mjs`) holds small pure helpers specifically for
scaffolding a *new* simulator pack (pluralization/singularization, lifecycle
field defaults, semantic type inference) — kept separate from `registry.mjs`
because one is "read the registry" and the other is "generate a new registry
entry."

## `data/`

The largest and most heterogeneous directory: cloud-data and mock-data
planning. `bigquery-types.mjs` (value→BigQuery type inference),
`lakehouse-targets.mjs` (source-system → lakehouse-target classification),
(the hand-rolled-layout YAML + Snowfakery-expression rendering that used to
live here as `yaml-render.mjs`/`snowfakery-recipe-render.mjs` now ships from
`@ge/synthkit/snowfakery`, byte-compatible with the legacy planner output),
`render-cloud-data-plan.mjs`
(BigQuery schema + manifest derivation for the cloud-data packager),
`build-cloud-data-artifacts.mjs` (the file-writing orchestration around that
derivation — resolves project/dataset/bucket/prefix, walks the fixture
manifest, writes schemas/NDJSON/load-script/manifest/mcp-tools.json, and
marks the pipeline's `cloudDataPlan` step; this is `cmdDataPlan`'s only real
dependency besides pipeline state I/O), `semantic-model.mjs` (NL→SQL semantic
layer: table/column descriptions, keys, joins, glossary),
`mcp-tool-descriptors.mjs` (MCP tool spec derivation from a fixture
manifest), `pack-bridges.mjs` (scenario-pack → simulator bridge projection),
and `use-case-resolve.mjs` (fuzzy use-case lookup/matching for the mock-data
planner CLI). These were grouped as "everything the mock-data / cloud-data
planners need," which is why the directory reads more like a bag of planner
utilities than one cohesive concern — if this directory grows further it may
be worth splitting `use-case-resolve.mjs` (CLI-facing lookup) out from the
rest (rendering/derivation).

## `lifecycle/`

Just `deploy.mjs` — the cloud-facing lifecycle stage orchestration: MCP
tool-plane management (`cmdMcp`), deploy (`cmdDeploy`/`cmdDeployStatus`/
`cmdVerifyLive`, Agent Runtime or Cloud Run), Agent Registry registration
(`cmdRegister`), and Gemini Enterprise publish (`cmdPublish`) — plus every
gcloud/agents-cli helper only they use (project/region resolution, runtime-id
parsing, Gemini Enterprise app-id resolution, tool-spec building,
reachability checks). Grouped as one file rather than split further because
these commands are tightly coupled to EACH OTHER (register/publish/
deploy-status all read `deployment_metadata.json` through the same
`parseAgentRuntimeId`/`hydrateDeployStepFromMetadata` path) even though
they're only loosely coupled to the rest of `factory.mjs`'s local pipeline
commands — a real seam, but not one with sub-seams worth their own files yet.
`factory.mjs` injects pipeline state I/O, the `ok()`/`fail()` contract,
`runCommand`, `runLifecycleCommand`, `assertPromotable`, and the resolved
`AGENT_MODEL` as `deps`, same pattern as everywhere else in this tree.

## `harness/`

Just `harness.mjs` — Antigravity harness orchestration: `cmdHarnessReview`
(read-only spec-to-code audit) and `cmdHarnessRefine` (write-enabled
implementation pass), plus `readWorkspaceReviewContext`,
`applyHarnessReviewFeedback`, and the refine-resume helpers that only they
use. `factory.mjs` injects pipeline state I/O, the harness-runner/
harness-work-item bridges, the zod schemas, and the flag predicates
(`truthyFlag`/`wantsVertex`/`envOff`) that are also used elsewhere in
`factory.mjs` (`assertPromotable`, quality-gate, from-usecase, batch-audit)
as `deps`. Both `cmdHarnessReview`/`cmdHarnessRefine` intentionally return
their bare summary object rather than `ok(summary)` — they're composed
in-process by `cmdFromUseCase`/`cmdBatchAudit`/`cmdQualityGate`, which embed
the return value verbatim; wrapping here would double-wrap `ok:true` and
change byte-identical JSON output. See the inline NOTE comments preserved
from the original for the full rationale.

## `packs/`

Scenario/domain packs — one file per business domain (`analytics.mjs`,
`crm-marketing-ops.mjs`, `finance-erp.mjs`, `hr-benefits.mjs`,
`hr-employee-records.mjs`, `identity-security.mjs`, `itsm.mjs`,
`learning-talent.mjs`, `procurement-ops.mjs`, `seo-monitoring.mjs`,
`third-party-risk.mjs`, `content-collaboration.mjs`, `digital-assets.mjs`),
plus `index.mjs` (the pack registry: `listScenarioPacks`,
`matchScenarioPacks`, `enrichScenarioSpec`), `taxonomy.mjs` (department/domain
classification), `coverage.mjs` (which packs/systems/entities a use case
covers), and `pack-utils.mjs` (shared pack helpers). Each pack encodes
domain-specific fixture/eval/instruction enrichment for its business area;
one file per domain keeps each pack's content independently reviewable and
means adding a new domain never requires touching the others.

## `tools/`

Python tool-source rendering: `py-emit.mjs` (low-level string-escaping
primitives shared by every generated-Python renderer), `tool-naming.mjs`
(canonical query-tool naming — the single source of truth both the generator
and the agent-instruction renderers use, so a sub-agent can never be wired to
a tool name that wasn't actually emitted), `render-query-tools.mjs`
(per-table `query_<table>` tool rendering), `render-contract-tools.mjs`
(behavior-contract intents → fixture-backed Python tools), and
`render-tools-py.mjs` (assembles the full generated `app/tools.py`). Split out
as "everything that emits or names the generated agent's Python tools,"
distinct from `agents/render-agent-py.mjs` which renders the agent object
itself.

## `evals/`

Just `render-eval-artifacts.mjs` — the factory-side binding of
`@ge/evalkit`'s eval-artifact renderers (the four deterministic workspace
artifacts: `evals/golden.json`, the agents-cli evalset, `eval_config.json`,
`optimization_config.json`). The renderers themselves live in
`packages/evalkit/src/emitters/`; this module injects the factory's canonical
tool-naming and OKF test-mechanism derivation (which a leaf package must not
import) and re-exports the rest untouched.

## `core/`

Just `contract-schema.mjs` — shared behavior-contract vocabulary
(`CONTRACT_TOOL_KINDS`, `CONTRACT_INTENT_KINDS`) and table-naming helpers
(`tablePrimaryKey`, materialized/query-table naming) that multiple other
modules (`agents/`, `tools/`, `evals/`) depend on. Named `core` because it's
the shared low-level vocabulary/schema that the higher-level renderers build
on — this is the one directory in the tree that's a dependency *of* several
others rather than an independent concern, so if you're chasing "why do two
directories agree on a naming convention," this is usually why.

## The golden/parity-oracle test pattern

Four test files under `apps/factory/tests/` (`factory-tools-golden.test.js`,
`factory-cloud-data-golden.test.js`, `plan-mock-data-golden.test.js`,
`scaffold-simulator-pack-golden.test.js`) share a common helper module,
`apps/factory/tests/golden-test-helpers.mjs` (`runGoldenOracle`,
`walkAndSnapshot`, `stableSnapshotJson`, `compareOrUpdateGolden`). Each oracle
runs a real CLI script (this directory's scripts, or `scripts/factory.mjs`)
against a fixture in a throwaway OS tmpdir, snapshots the emitted output
tree, and asserts it's byte-identical to a committed golden file under
`apps/factory/tests/fixtures/*-golden/`. This is what made the `factory.mjs`
decomposition (see `REFACTOR-HANDOFF.md` §9) tractable at all — the
bottleneck for large mechanical extractions is always *verification*, not
editing, and a byte-exact oracle turns "does this refactor change behavior?"
into a single fast, deterministic diff instead of manual re-review.

To add a new golden fixture for a new command/renderer:
1. Write a test that calls `runGoldenOracle({ tmpPrefix, command/args (or
   `setupFixture` + inline `execFileSync`), snapshot })` to produce a snapshot
   of the generated workspace (or a subset of it — see the cloud-data oracle,
   which snapshots only `mock_data/cloud/**`).
2. If any emitted output is non-deterministic (timestamps), either mask it
   with a regex (`walkAndSnapshot`'s `mask`/`maskWith` options, as
   `plan-mock-data-golden.test.js` does for ISO-8601 `generatedAt` values) or
   pin the clock via `GE_SOURCE_DATE` if the script under test honors it (as
   `factory-tools-golden.test.js` and `factory-cloud-data-golden.test.js` do).
3. Commit the first golden snapshot alongside the test (generate it once
   under the update path below and review the diff — there's no golden yet
   to compare against on the first run).
4. Wire up regeneration for future intentional changes via
   `compareOrUpdateGolden`, gated on an env var. Existing call sites don't
   agree on the exact variable name (`GE_UPDATE_GOLDEN` is the
   `compareOrUpdateGolden` default, but `scaffold-simulator-pack-golden.test.js`
   uses `GE_SCAFFOLD_GOLDEN_WRITE` and checks it directly) — pick whichever is
   clearest for the new fixture and document it in the test file's header
   comment, e.g. `GE_UPDATE_GOLDEN=1 bun test <path-to-your-golden-test>`.

Regenerating a golden is a change that must be reviewed like any other diff —
if a golden test fails after your change, treat the fixture as correct by
default (see "Golden/parity-oracle tests are byte-exact on purpose" in
`AGENTS.md`) and only regenerate once you've confirmed the *new* output is
actually right.

## `packs/`, `simulators/`, `data/` cross-reference note

`packs/index.mjs` is imported by both `use-case/schema-derivation.mjs` and
`projections/simulator-projections.mjs` (via `simulators/registry.mjs`'s
family/archetype matching) — scenario packs are the connective tissue between
"what domain is this use case" and "which simulator backs it," which is why
you'll see `packs` imported from directories that aren't obviously about
scenario content.
