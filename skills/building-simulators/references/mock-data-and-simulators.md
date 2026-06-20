# Mock Data And Simulators

Use this when Antigravity must operate scenario data generation or simulator seeding.

## First Step

Load the normalized spec or mission plan and identify:

- source systems from `generationSpec.sourceSystems`
- entities/data contracts from `generationSpec.entities` or `generationSpec.dataContracts`
- documents from `generationSpec.documents`
- tools from `generationSpec.behaviorContract.toolIntents`
- eval evidence refs from `generationSpec.behaviorContract.goldenEvals`

Do not create data, simulator systems, tools, or citations outside that scope. If scope is missing, update the spec first through `interviewing-specs`.

Prefer the simulator SDK plan so Antigravity uses existing systems before scaffolding anything new:

```bash
node apps/ge-demo-generator/scripts/simulator-sdk.mjs plan --spec <normalized-spec.json> --simulator-id <system_id>
```

The SDK returns:

- whether an existing simulator registry entry should be used
- whether scaffolding is required
- exact node commands for mock generation, Snowfakery, simulator seed, and validation
- expected structured and unstructured artifacts
- next repair actions

## Node Workflow

Run nodes in this order:

```text
mock.generate
  -> snowfakery.generate
  -> simulator.seed
  -> simulator.validate
```

The mission graph should own this sequence when possible:

```bash
bun tools/ge.mjs mission plan --scenario <usecase_id> --target-stage preview --json
bun tools/ge.mjs mission run --scenario <usecase_id> --target-stage preview
```

Use direct commands only when debugging a single node.

## Direct Commands

Generate the scenario graph, data plan, Snowfakery recipe, realization plan, and simulator index:

```bash
node apps/ge-demo-generator/scripts/plan-mock-data.mjs --dir <mission-workspace> --usecase <usecase_id> --sourceMap apps/ge-demo-generator/src/use-case-source-map.generated.json
```

Generate Snowfakery rows:

```bash
snowfakery <mission-workspace>/mock_data/snowfakery/structured.recipe.yml --output-format csv --output-folder <mission-workspace>/mock_data/snowfakery/output
```

Materialize Snowfakery rows into simulator seed overlays:

```bash
node apps/ge-demo-generator/scripts/materialize-simulator-seeds.mjs --dir <mission-workspace>
```

Validate simulator conformance:

```bash
node apps/ge-demo-generator/scripts/validate-simulator-pack.mjs --check true --system <system_id>
```

## Expected Artifacts

`mock.generate` must produce:

- `mock_data/plan/data-plan.json`
- `mock_data/scenario/scenario-graph.json`
- `mock_data/snowfakery/structured.recipe.yml`
- `mock_data/snowfakery/realization-plan.json`
- `mock_data/simulators/simulator-index.json`
- `mock_data/blobs/object-plan.yaml` when documents or document-store sources are in scope
- `mock_data/blobs/documents_manifest.ndjson` when documents or document-store sources are in scope

`snowfakery.generate` must produce:

- CSV files under `mock_data/snowfakery/output/`

`simulator.seed` must produce:

- `mock_data/simulators/materialization-report.json`
- simulator seed overlay files under `mock_data/simulators/`

`simulator.validate` must produce:

- a JSON conformance report on stdout when run by the runtime/mission node

## Unstructured Data

`.md`, PDF, DOCX, policy, guide, contract, SOP, and long-form evidence files are unstructured artifacts.

Local generation uses:

- `fixtures/documents/*.md` for workspace-local evidence documents
- `evals/golden.json` citation expectations via `mustCiteDocuments`
- generated document tools such as `list_documents`, `read_document`, and `search_documents`

Mock-data packaging uses:

- `mock_data/blobs/object-plan.yaml`
- `mock_data/blobs/manifest.yaml`
- `mock_data/blobs/documents_manifest.ndjson`
- `mock_data/blobs/gcs/objects/`
- `mock_data/cloud/bigquery/ndjson/documents_manifest.jsonl`

Cloud shape:

- object bytes go to GCS-style blob storage
- document metadata and citation rows go to BigQuery `documents_manifest`
- agents retrieve/cite documents through generated document tools or MCP document adapters

Do not flatten `.md` policy evidence into random relational rows. Keep the object as an inspectable artifact and store only metadata/citation references in structured stores.

Antigravity should treat missing `.md` evidence as a spec/data gap:

1. Add or repair `generationSpec.documents`.
2. Regenerate mock data.
3. Validate that blob/document manifests exist.
4. Ensure golden evals cite declared document ids.
5. Ensure generated tools can list/read/search those documents.

## Validation Rules

Treat these as blockers:

- requested source system is missing from simulator index
- Snowfakery realization has no objects
- Snowfakery generated zero rows
- generated CSV object names do not match the realization plan
- materialization report is not `ok`
- requested simulator has no materialized collections
- requested simulator materialized zero rows
- simulator conformance report has errors
- golden eval cites a document id not declared in `generationSpec.documents`
- document tools are expected but generated document artifacts are missing

Treat warnings as repair guidance, not automatic blockers:

- fewer CSV files than realization objects
- zero input rows for a noncritical collection
- simulator conformance warnings without errors

## Antigravity Repair Loop

1. Read the failing node summary, blockers, and artifact checks.
2. Inspect only the relevant artifact files.
3. Repair the spec, data plan, pack bridge, or simulator pack contract.
4. Rerun the smallest safe node:

```bash
bun tools/ge.mjs runtime resume <task_id>
```

5. If the runtime cannot resume, rerun the direct node command and then return to mission status.

Do not patch generated CSVs by hand except as a temporary debug proof. Durable fixes belong in the spec, scenario pack, Snowfakery realization plan, materialization mapping, or simulator pack.

## Next Step

After simulator validation passes, proceed to factory generation and Agents CLI eval:

```bash
bun tools/ge.mjs agents build --ids <usecase_id> --local --target harness_refined
cd <generated-workspace>
agents-cli eval run --all
```
