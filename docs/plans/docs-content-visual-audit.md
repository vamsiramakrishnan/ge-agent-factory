# Docs content & visual audit — Phase 0 (2026-07-02)

Scorecard behind the docs content/visual elevation pass. Grades every
published page (`docs/index.md`, `start/`, `concepts/`, `cookbooks/`,
`console/`, `operations/` + `OPERATIONS.md`, `reference/`, plus the top-level
contributor pages) 0–2 on each of the four elite properties from the mission
brief, then assigns one disposition. Unpublished trees (`plans/`, `adr/`,
`runbooks/`) are out of scope.

- **Visuals-as-system** — has a diagram using the established token system
- **Screenshots-don't-rot** — has a screenshot with a regeneration path
  (score 2 = N/A, page legitimately doesn't need one)
- **Executed-not-imagined** — command/output blocks read as a real captured
  run, not illustrative prose
- **Every-abstraction-has-a-picture** — every structure the page asks the
  reader to hold in their head has a diagram, table-as-diagram, or annotated
  example

| Page | Visuals | Screenshots | Executed | Abstraction | Total/8 | Disposition | Notes |
|---|---|---|---|---|---|---|---|
| docs/index.md | 2 | 0 | 2 | 2 | 6/8 | needs screenshot | Uses concept-pipeline.svg; no console screenshot on landing page |
| docs/start/getting-started.md | 2 | 0 | 1 | 2 | 5/8 | needs screenshot | Uses factory-line.svg; no captured command output, no console screenshot |
| docs/start/mental-model.md | 2 | 0 | 1 | 2 | 5/8 | needs screenshot | Uses factory-line.svg; stage flow is illustrative ASCII, not captured |
| docs/start/vs-agents-cli.md | 0 | 2(N/A) | 1 | 1 | 4/8 | needs diagram | Zero images; layer comparison is table-only, no diagram |
| docs/concepts/index.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses concept-pipeline.svg |
| docs/concepts/agent-passport-and-proof-pack.md | 0 | 2(N/A) | 2 | 2 | 6/8 | needs diagram | Zero images; two good tables but no artifact-flow diagram |
| docs/concepts/authority-graph.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses write-guard-flow, tool-authz-chain, security-mental-model svgs |
| docs/concepts/enterprise-agent-contract.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses workflow-spine.svg + real annotated contract JSON |
| docs/concepts/evals-as-proof.md | 0 | 2(N/A) | 1 | 1 | 4/8 | needs diagram | Zero images; 4-step proof chain described only as a table |
| docs/concepts/handoff-targets.md | 0 | 2(N/A) | 1 | 1 | 4/8 | needs diagram | Zero images; release stage flow is a plain code-block list |
| docs/concepts/source-system-twins.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses byo-synthesis.svg + simulator-backend-flow.svg |
| docs/cookbooks/index.md | 0 | 2(N/A) | 2 | 2 | 6/8 | needs diagram | Zero images; orphaned cookbook-paths.svg looks built for this page |
| docs/cookbooks/capture-from-documents.md | 0 | 0 | 1 | 1 | 2/8 | needs screenshot | Zero images; heavy dropzone/UI description, no diagram either |
| docs/cookbooks/capture-from-interview.md | 2 | 0 | 2 | 2 | 6/8 | needs screenshot | Uses interview-artifact-stream.svg; no canvas screenshot |
| docs/cookbooks/capture-from-openapi.md | 0 | 0 | 2 | 1 | 3/8 | needs diagram | Zero images; byo-synthesis.svg exists but isn't reused here |
| docs/cookbooks/compile-a-contract.md | 2 | 0 | 2 | 2 | 6/8 | needs screenshot | Uses canary-workspace.svg; real captured build output line |
| docs/cookbooks/generate-simulations.md | 2 | 0 | 2 | 2 | 6/8 | needs screenshot | Uses byo-synthesis.svg; console Systems field undocumented visually |
| docs/cookbooks/handoff-adk-gemini-enterprise.md | 2 | 0 | 2 | 2 | 6/8 | needs screenshot | Uses factory-line.svg; real captured "Shipped" output line |
| docs/cookbooks/handoff-agents-cli.md | 0 | 0 | 2 | 1 | 3/8 | needs diagram | Zero images; real manifest YAML but no handoff diagram |
| docs/cookbooks/prove-an-agent.md | 2 | 0 | 2 | 2 | 6/8 | needs screenshot | Uses eval-derivation.svg; concrete artifact paths and verdict fields |
| docs/cookbooks/repair-failed-proof.md | 0 | 0 | 2 | 1 | 3/8 | needs diagram | Zero images; repair loop described only as numbered steps |
| docs/cookbooks/spec-to-okf.md | 2 | 0 | 2 | 2 | 6/8 | needs screenshot | Uses okf-spine.svg; no Spec Review canvas screenshot |
| docs/console/index.md | 2 | 0 | 2 | 2 | 6/8 | needs screenshot | Uses run-drawer-follow.svg; console tour has zero UI screenshots |
| docs/console/contract-editor.md | 0 | 0 | 2 | 0 | 2/8 | needs screenshot | Zero images; two-panel Interview/Spec Review UI described in prose only |
| docs/console/fleet-and-repair.md | 0 | 0 | 2 | 0 | 2/8 | needs screenshot | Zero images; three UI surfaces (Fleet/Repair/Detail) prose only |
| docs/console/pipeline-and-runs.md | 2 | 0 | 2 | 1 | 5/8 | needs screenshot | Uses run-drawer-follow.svg; wizard steps not illustrated |
| docs/console/readiness.md | 0 | 0 | 2 | 1 | 3/8 | needs screenshot | Zero images; verdict UI (READY/NEEDS ATTENTION) undepicted |
| docs/operations/agent-gateway.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses tool-authz-chain.svg; real gcloud/terraform commands |
| docs/operations/provision-the-platform.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses three-planes.svg; two concrete provisioning paths |
| docs/operations/run-and-observe.md | 2 | 0 | 2 | 2 | 6/8 | needs screenshot | Uses factory-line.svg; describes live console view, no image |
| docs/operations/troubleshooting.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Zero images but table format is appropriate; no diagram needed |
| docs/OPERATIONS.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses factory-line.svg + access-posture-tiers.svg |
| docs/reference/index.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Zero images but pure index/table page, appropriate |
| docs/reference/agent-generation.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses workflow-spine.svg + dual-backend.svg; verified real imports |
| docs/reference/architecture.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses three-planes, durable-control-plane, factory-stages svgs |
| docs/reference/cli.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Zero images; generated command reference, no diagram needed |
| docs/reference/config.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Zero images; config field reference, no diagram needed |
| docs/reference/console-and-apis.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses ge-command-flow.svg; API/route reference not a UI tour |
| docs/reference/okf.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses okf-spine.svg + directory tree + concept-type table |
| docs/reference/simulator-systems.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses simulator-backend-flow.svg + state-backend-precedence.svg |
| docs/reference/spec-schema.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Zero images; huge generated field tables, appropriate |
| docs/DESIGN.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses system-map.svg as embedding example |
| docs/GLOSSARY.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Zero images; term glossary, no diagram needed |
| docs/MCP.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses mcp-tool-tiers.svg; real auth-chain tables |
| docs/developers.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses three-planes.svg; real mise/bash commands |
| docs/contributing/add-a-ge-command.md | 2 | 2(N/A) | 2 | 2 | 8/8 | fine as-is | Uses ge-command-flow.svg; real registry code + curl verification |

## Summary

**Systemic finding:** the diagram system (Mermaid + `beautiful-mermaid` +
docs tokens) is already mature — 24 `.mmd` sources, 24 matching SVGs, 22
embedded in published pages, none stale. The single biggest gap across the
whole site is **screenshots: zero exist anywhere.** Every "needs screenshot"
disposition below is really "this page describes a UI surface with nothing
but prose." That makes the screenshot factory (Phase 3 of the mission brief)
the highest-leverage single investment.

**Bottom of the pack:**
1. `docs/console/contract-editor.md` — 2/8 (zero images, prose-only UI description)
2. `docs/console/fleet-and-repair.md` — 2/8 (zero images, prose-only UI description)
3. `docs/cookbooks/capture-from-documents.md` — 2/8 (zero images, heavy dropzone UI, no diagram)
4. `docs/cookbooks/capture-from-openapi.md` — 3/8
5. `docs/cookbooks/handoff-agents-cli.md` — 3/8
6. `docs/cookbooks/repair-failed-proof.md` — 3/8
7. `docs/console/readiness.md` — 3/8
8. (3-way tie at 4/8) `docs/start/vs-agents-cli.md`, `docs/concepts/evals-as-proof.md`, `docs/concepts/handoff-targets.md`

The console-tour pages and several "capture"/"handoff"/"repair" cookbooks
cluster at the bottom for two different reasons: the console pages describe
real UI surfaces with zero visuals at all (screenshot gap), while several
concept/cookbook pages that discuss a genuine flow (proof chain, handoff
targets, repair loop) have no diagram despite the repo's own diagram token
system being well established elsewhere (diagram gap, cheap to close).

**Pages with zero images (18 of 46 audited):** `start/vs-agents-cli.md`,
`concepts/agent-passport-and-proof-pack.md`, `concepts/evals-as-proof.md`,
`concepts/handoff-targets.md`, `cookbooks/index.md`,
`cookbooks/capture-from-documents.md`, `cookbooks/capture-from-openapi.md`,
`cookbooks/handoff-agents-cli.md`, `cookbooks/repair-failed-proof.md`,
`console/contract-editor.md`, `console/fleet-and-repair.md`,
`console/readiness.md`, `operations/troubleshooting.md`, `reference/index.md`,
`reference/cli.md`, `reference/config.md`, `reference/spec-schema.md`,
`GLOSSARY.md`. About half of these (pure reference/CLI/glossary pages) are
legitimately fine text-only; the rest — three console UI pages, two proof/
handoff concept pages, and three cookbooks — are real gaps this pass targets.

**Diagram inventory:** `docs/diagrams-src/` has 24 `.mmd` sources, each with
a matching SVG (1:1, none stale). 22 are embedded in published pages. Two
exist only in unpublished trees (`control-plane-migration.svg` in
`docs/adr/`, `security-cutover-stages.svg` in `docs/runbooks/`). One is fully
orphaned — referenced nowhere in `docs/` at all: `cookbook-paths.svg`. Given
its name, it was clearly built for `docs/cookbooks/index.md`, which has zero
images despite being a flow-shaped "which guide do I need" page — wiring it
in there is a five-minute fix (see Phase 5/7 below).

## What this pass targets, in priority order

1. **Screenshot factory** (Phase 3 in the mission brief) — the single
   highest-leverage gap. Seed script + Playwright capture script against the
   console, wired into `bun run docs:shots`.
2. **Diagram gaps on the six 2–4/8 pages** — `console/contract-editor.md`,
   `console/fleet-and-repair.md`, `console/readiness.md`,
   `cookbooks/capture-from-openapi.md`, `cookbooks/handoff-agents-cli.md`,
   `cookbooks/repair-failed-proof.md` — plus wiring the orphaned
   `cookbook-paths.svg` into `cookbooks/index.md`.
3. **Signature pipeline diagram** (Phase 2) — a hero capture→contract→
   simulate→eval→prove→handoff visual with per-stage zoom variants, replacing
   the current `concept-pipeline.svg` (which only covers generate→publish and
   omits capture as a first-class stage) as the one visual every Core
   Concepts page shares.
4. **Annotated examples** (Phase 5) — passport/proof-pack and authority graph
   pages already have some; extend to a real generated-artifact file tree.
5. **Verified-run elevation** (Phase 4) — pages scoring 1 on "Executed" have
   plausible-looking but not clearly-provenanced output; re-run and re-anchor
   against a real `ge devex smoke` (or equivalent) execution where feasible
   in this environment.
