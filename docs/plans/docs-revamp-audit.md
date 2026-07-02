# Docs revamp — Phase 0 audit and target information architecture

Date: 2026-07-02. This is the working audit behind the "contract compiler
layer" docs revamp. It records, for every published docs page, what it is
today and where it goes in the new IA — plus the ground-truth constraints
(generated regions, sync-script mechanics, command reality) the revamp must
not break. The unpublished trees (`plans/`, `design-specs/`, `runbooks/`,
`adr/`) are out of scope except where content relocates into them.

## Positioning spine

GE Agent Factory is the **enterprise agent contract compiler layer above
agents-cli / ADK / Gemini Enterprise**: capture enterprise intent → compile an
Enterprise Agent Contract → generate simulations / evals / tools / proof →
hand off. Every page must leave the reader certain of that layer.

## Ground truth (what exists today — the honesty constraints)

- **No `ge capture`, `ge prove`, `ge handoff`, or `ge contract` commands.**
  Real equivalents: console Interview + Spec Review and `ge pipeline` for
  capture; `ge devex smoke`, workspace evals, the promotion gate, and the
  console Readiness view for proof; `ge agents ship` for handoff. The golden
  path `ge capture → ge prove → ge handoff` appears only Roadmap-flagged.
- **The contract exists as data, not a command:** a use-case spec
  (`generationSpec` + `behaviorContract`, zod schema in
  `packages/agent-spec/src/schema.ts`) with a portable Markdown twin (OKF
  bundle). "Enterprise Agent Contract" is the docs' name for this pair.
- **Proof artifacts today:** validation report, spec-to-code trace, harness
  review/refine verdicts, evalset results, promotion packet — gated by the
  promotion gate before deploy. There is **no single passport file**; the
  nearest identity artifacts are `agents-cli-manifest.yaml`, the Agent
  Registry entry, and the per-agent runtime identity.
- **Handoff reality:** generated workspaces are real `agents-cli`/ADK
  projects (`agents-cli-manifest.yaml`, `deployment_target: agent_runtime`);
  `ge agents ship` runs the post-boundary stages
  `load_data → deploy_runtime → register_tools → publish_enterprise`.
- **Generated regions (do not move these files without updating their
  generators):** `docs/reference/cli.md` (`ge-command-tree`,
  `tools/gen-cli-reference.mjs`), `docs/reference/spec-schema.md` (3 regions,
  `packages/agent-spec/scripts/gen-spec-reference.mjs`),
  `docs/reference/console-and-apis.md` (`ge-console-commands`,
  `tools/gen-console-api-reference.mjs`), `docs/diagrams-src/factory-stages.mmd`
  (`apps/factory/scripts/gen-stage-diagram.mjs`).
- **Site sync:** `apps/docs/scripts/sync-content.mjs` — top-level pages need a
  `PAGE_MAP` entry; only mapped directories pass through; new directories must
  be added to `destFor` and `WIPE_DIRS`, and the Astro sidebar updated in the
  same change.

## Target information architecture

| Section | Directory / source | Sidebar label |
|---|---|---|
| Start Here | `docs/index.md` + `docs/start/` | Start Here |
| Core Concepts | `docs/concepts/` | Core Concepts |
| Guides | `docs/cookbooks/` (routes kept) | Guides |
| Console | `docs/console/` (new) | Console |
| Operations | `docs/OPERATIONS.md` → `operations/index` + `docs/operations/` | Operations |
| Reference | `docs/reference/` (generated files stay put) | Reference |
| Contributor Docs | `docs/contributing/` (new) + `DESIGN.md`, `developers.md` | Contributor Docs |

## Page-by-page dispositions

### Top level

| Page | Disposition |
|---|---|
| `index.md` | **Rewrite** as "What is GE Agent Factory?" — pure positioning: the layer, the contract, the proof, the handoff. Route kept (`start/what-is-the-factory`). |
| `developers.md` | **Relocate** to Contributor Docs (`contributing/developer-guide`); repo-map overlap with CONTRIBUTING.md deduped by cross-link. |
| `OPERATIONS.md` | **Split**: anchor content → `operations/index`; troubleshooting → `docs/operations/troubleshooting.md`; live-rename cutover section → `docs/runbooks/` (point-in-time, archived). |
| `MCP.md` | **Keep** at `reference/mcp` (factory MCP server + tool plane); demoted-noun pass. |
| `GLOSSARY.md` | **Keep + extend**: add Enterprise Agent Contract, Proof pack / Promotion packet, Source-system twin, Handoff, Agent passport (with honest "today this is N files" wording). |
| `DESIGN.md` | **Keep** in Contributor Docs; reconcile Jekyll-era wording with the Starlight pipeline. |
| `modularization-audit.md` | Unpublished; keep as-is. |

### Concepts → Core Concepts

| Page | Disposition |
|---|---|
| `concepts/index.md` | **Rewrite** around the six contract-layer concepts. |
| `specs-and-okf.md` | **Rewrite** as `enterprise-agent-contract.md` — the contract (behaviorContract + generationSpec) and its OKF twin. Resolve the OKF internal-vs-external contradiction (it is this repo's format). Spec→OKF mapping table: canonical copy stays in `reference/okf.md` / the Spec⇄OKF guide. |
| `the-factory-line.md` | **Merge**: mental-model spine → `start/mental-model.md`; stations-vs-milestones + durable control plane → `reference/architecture.md`; stage-by-stage detail → concepts stays via mental model links. File removed after links repointed. |
| `agents-and-adk.md` | **Rewrite** as `handoff-targets.md` — agents-cli / ADK / Agent Engine / Gemini Enterprise as the downstream layer; generated-agent anatomy stays in `reference/agent-generation.md`. |
| `simulators-and-byo.md` | **Rewrite** as `source-system-twins.md`; pack-file table canonical in `reference/simulator-systems.md`. |
| `security-and-the-agent-gateway.md` | **Split**: authority mental model → `authority-graph.md` (new); runbook half (SA matrix, terraform vars, DRY_RUN→ENFORCED mechanics) → `operations/agent-gateway.md`. |
| *(new)* `evals-as-proof.md` | Evals, harness review/refine, spec-to-code trace, promotion gate = the proof chain. |
| *(new)* `agent-passport-and-proof-pack.md` | Honest inventory of today's proof/identity artifacts + Roadmap note for a consolidated passport. |

### Cookbooks → Guides (directory name kept; sidebar label "Guides")

| Page | Disposition |
|---|---|
| `cookbooks/index.md` | **Rewrite** as Guides hub; recipe-contract authoring rules → Contributor Docs. |
| `getting-started.md` | **Relocate** to `docs/start/getting-started.md` (Start Here owns onboarding). |
| `author-a-spec-via-interview.md` | **Rewrite** as `capture-from-interview.md` (guide template); console specifics cross-linked to Console section. |
| *(new)* `capture-from-openapi.md` | OpenAPI mode of simulator synthesis — capturing a source system, honestly framed. |
| *(new)* `capture-from-documents.md` | BRD/document upload path into the interview. |
| `generate-an-agent.md` | **Rewrite** as `compile-a-contract.md` — one contract → one workspace; owns the `ge agents build` flag detail. |
| `bring-your-own-simulator.md` | **Rewrite** as `generate-simulations.md`; scaffold/validate/seed detail kept. |
| `run-evals.md` | **Rewrite** as `prove-an-agent.md` — evals + promotion gate + readiness. Canonical eval command is `agents-cli eval run` (GLOSSARY's `factory eval` wording fixed). |
| *(new)* `repair-failed-proof.md` | `ge fleet repair`, Repair Queue, `ge runs resume`. |
| *(new)* `handoff-agents-cli.md` | The workspace IS an agents-cli project; run/deploy it directly. |
| *(new)* `handoff-adk-gemini-enterprise.md` | `ge agents ship` → deploy_runtime → register_tools → publish_enterprise. |
| `spec-to-okf.md` | **Keep** (Contract ⇄ OKF portability guide). |
| `run-the-factory.md` | **Relocate** to `operations/run-and-observe.md` (runs/resume/ledger/fleet observability). |
| `provision-the-platform.md` | **Relocate** to `operations/provision-the-platform.md`. |
| `deploy-the-agent-gateway.md` | **Relocate/merge** into `operations/agent-gateway.md`. |
| `add-a-ge-command.md` | **Relocate** to `contributing/add-a-ge-command.md`. |

### Reference (files with generated regions stay at their paths)

| Page | Disposition |
|---|---|
| `reference/index.md` | **Rewrite** routing tables for the new IA. |
| `reference/cli.md` | **Keep** (generated region untouched); prose intro tightened to the layer framing. |
| `reference/spec-schema.md` | **Keep path**; retitle "Contract schema (use-case spec)"; consumer checklist stays with a Contributor cross-link. |
| `reference/console-and-apis.md` | **Keep** (generated region); Views table slimmed to point at the Console section. |
| `reference/architecture.md` | **Keep in Reference** (absorbs stations-vs-milestones + durable control plane from the-factory-line). Contributor Docs links to it. |
| `reference/okf.md` | **Keep**; canonical OKF mapping. |
| `reference/agent-generation.md` | **Keep**; retitle "Generated artifacts" framing; sample-staleness warning preserved. |
| `reference/simulator-systems.md` | **Keep**; canonical pack contract. |
| *(new)* `reference/config.md` | `.ge.json` / config precedence / `ge config explain` (hand-written; schema generated at `.ge.schema.json`). |

### Console (new section, grounded in real views)

`docs/console/`: `index.md` (what the console is; live status model),
`readiness.md` (Doctor view), `contract-editor.md` (Interview + Spec Review),
`pipeline-and-runs.md` (Pipeline, Runs, Run Drawer), `fleet-and-repair.md`
(Fleet, Repair Queue, Agent detail). Sourced from `reference/console-tour.md`,
which is then removed with links repointed. Console views that the brief
imagines (simulation explorer, eval debugger, proof pack screen) do not exist
and are listed only under Roadmap.

### Contributor Docs

`docs/contributing/`: `index.md` (from developers.md, deduped),
`add-a-ge-command.md`, `docs-rules.md` (recipe contract + authoring rules),
plus DESIGN.md (`contributing/docs-design`) and external links to
CONTRIBUTING.md / SETUP.md.

## Duplication clusters resolved by this plan

1. Planes/modes/build boundary (architecture ↔ OPERATIONS ↔ developers) — one
   owner: `start/mental-model.md` for the idea, `reference/architecture.md`
   for the mechanism, Operations for the runbook.
2. Console views (console-and-apis ↔ console-tour ↔ OPERATIONS) — narrative in
   `docs/console/`, API surface in `reference/console-and-apis.md`.
3. Spec→OKF mapping table (concepts ↔ cookbook) — canonical in Reference/guide.
4. Simulator pack file set (concepts ↔ cookbook) — canonical in
   `reference/simulator-systems.md`.
5. Dual tool backend (agents-and-adk ↔ simulators-and-byo) — owned by
   `reference/agent-generation.md`.
6. Agent Gateway DRY_RUN/501 facts (concept ↔ cookbook) — why in
   `concepts/authority-graph.md`, how in `operations/agent-gateway.md`.
7. `ge agents build` invocation (generate-an-agent ↔ run-the-factory) — build
   in `compile-a-contract.md`, observe/resume in `operations/run-and-observe.md`.

## Contradictions and stale content to fix

- OKF described as external standard in one page, internal format in another
  → internal format, stated once.
- GLOSSARY says evals run with `factory eval`; the guide (correctly) uses
  `agents-cli eval run` → glossary fixed.
- OPERATIONS "Live rename cutover" is point-in-time → archived to runbooks.
- DESIGN.md still speaks Jekyll in places → reconciled with the Starlight
  pipeline.

## Language discipline

Primary nouns (lead everywhere): contract, authority, source system,
simulation, eval, proof, handoff, passport, risk, coverage. Demoted nouns
(explain on first use, never lead): daemon, ledger, planes, fleet, pipeline,
mission, journey, harness. Final pass greps Start Here + Core Concepts for
demoted nouns; unexplained leads are bugs.
