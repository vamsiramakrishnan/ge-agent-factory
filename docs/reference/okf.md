---
title: OKF
parent: Reference
nav_order: 4
layout: default
---

# OKF — Open Knowledge Format

OKF (Open Knowledge Format) v0.1 is the factory's **portable BRD format**: a
plaintext *Knowledge Bundle* of Markdown "Concept" files, each with YAML
frontmatter and a Markdown body. It lets a rich use-case spec be read, diffed,
hand-edited, and exchanged as ordinary Markdown, then round-tripped back into a
spec.

The integration has three pieces, all under
`apps/factory/scripts/`:

- [`spec-to-okf.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory) — spec → OKF bundle (export)
- [`okf-to-spec.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory) — OKF bundle → partial spec (ingest)
- [`skills/authoring-okf-specs/SKILL.md`](https://github.com/vamsiramakrishnan/ge-agent-factory) — the operator skill that drives the boundary (composes `interviewing-specs`)

The same bundle is also emitted into a generated agent at `app/knowledge/` (see
[Agent generation](agent-generation.html)) and served live by the console at
`GET /api/interviews/:id/okf` (see [Console & APIs](console-and-apis.html)).

<p align="center">
  <img src="../assets/diagrams/okf-spine.svg" alt="The OKF spine: the interview produces a spec in OKF form authorable by humans or agents, which drives generation of real ADK code, validation, tests derived from the contract, and runtime grounding where the agent cites the same systems and entities" width="750">
</p>

---

## What a bundle looks like

A bundle is a directory of `.md` concept files. Every concept's frontmatter has a
non-empty `type`; relationships are bundle-absolute Markdown links (`[…](/path/…)`).
Only the root `index.md` declares `okf_version: "0.1"`. Original spec ids are
preserved in a `source_id` field so the round-trip is stable.

```
<bundle-id>/
├── index.md            # type: Knowledge Bundle  (okf_version: "0.1")
├── log.md              # type: Log
├── playbook.md         # type: Playbook
├── kpis.md             # type: KPIs
├── evals.md            # type: Evals
├── systems/index.md    # type: Index
│   └── <id>.md         # type: Source System
├── tables/index.md
│   └── <entity>.md     # type: Data Entity
├── tools/index.md
│   └── <name>.md       # type: Agent Tool
├── workflow/index.md   # (only if a workflow exists)
│   └── <step>.md       # type: Workflow Stage
├── documents/index.md
│   └── <id>.md         # type: Source Document
├── queries/index.md
│   └── <id>.md         # type: Query Capability
└── tests/index.md
    └── <id>.md         # type: Eval Scenario
```

Each per-directory `index.md` (`type: Index`) gives progressive disclosure — index
before detail.

A concept file:

```markdown
---
type: Agent Tool
title: action_sap_s_4hana_fi_close
tags: [tool, action]
timestamp: 2026-06-20T00:00:00Z
source_id: action_sap_s_4hana_fi_close
---

# action_sap_s_4hana_fi_close

…
```

### Concept types

The converter emits exactly these `type` strings (verified in `spec-to-okf.mjs`):

`Knowledge Bundle` · `Log` · `Playbook` · `Index` · `Source System` ·
`Data Entity` · `Agent Tool` · `Workflow Stage` · `Source Document` ·
`Query Capability` · `Eval Scenario` · `KPIs` · `Evals`.

These map back to the spec: **Source System** ← `sourceSystems[]`, **Data Entity**
← `entities[]`, **Agent Tool** ← `toolIntents[]`, **Workflow Stage** ←
`workflow.steps[]`, **Source Document** ← `documents[]`, **Query Capability** ←
`answerableQueries` (or derived), **Eval Scenario** ← golden eval `mechanisms` (or
derived). See [Spec schema](spec-schema.html) for those source fields.

---

## Converters

### Export — `spec-to-okf.mjs`

```bash
# From the built catalog, by use-case id:
node apps/factory/scripts/spec-to-okf.mjs --id <useCaseId> [--out <dir>]

# From a spec JSON file directly:
node apps/factory/scripts/spec-to-okf.mjs --spec <path/to/spec.json> [--out <dir>]
```

- Catalog input: `apps/factory/generated/use-cases.generated.json`.
- Default output: `artifacts/okf/<id>/`.
- Output: a conformant OKF v0.1 Knowledge Bundle.

### Ingest — `okf-to-spec.mjs`

```bash
node apps/factory/scripts/okf-to-spec.mjs --bundle <dir>
```

Reads a bundle and prints a reconstructed **partial spec** as JSON to stdout —
recovering `behaviorContract` (role, objective, scope, toolIntents, the workflow
with ordering) and `generationSpec.{ sourceSystems, entities, documents }`.

### Round-trip

`spec → OKF → spec` is deterministic: tool names and system identities stay
stable, and `source_id` preserves original ids across the boundary. The
reconstructed spec is then re-enriched and registered through the
`interviewing-specs` flow before a build.

---

## The `authoring-okf-specs` skill

Source:
[`skills/authoring-okf-specs/SKILL.md`](https://github.com/vamsiramakrishnan/ge-agent-factory).
It moves a spec across the OKF boundary for portable, human-authored exchange and
**composes** `interviewing-specs`.

- **Input**: a catalog use-case id, a spec JSON path, or an OKF bundle directory.
- **Output**: a conformant OKF v0.1 bundle under `artifacts/okf/<id>/`, or a
  reconstructed partial spec JSON on stdout.
- **Next step**: hand the bundle to a consumer/human, or feed an ingested spec
  back through `interviewing-specs`.

## GE OKF Profile and substrate commands

GE treats OKF as the curated knowledge substrate: interview captures knowledge into OKF, OKF compiles into the buildable agent spec, and Live Proof validates the deployed surface against the compiled behavioral contract. The current agent spec remains the normalized build contract; the compiler keeps OKF and spec synchronized and reports drift.

Base OKF conformance follows the upstream permissive specification: concept Markdown files use YAML frontmatter with a non-empty `type`, recommended fields are not required, custom keys and unknown concept types are preserved, Markdown links express relationships, `index.md` supports progressive disclosure, `log.md` records update history, and `# Citations` is conventional for backing claims. GE quality gates are stricter but are reported separately from base conformance. See the official OKF ground truth: <https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md>.

The `ge okf` command group adds substrate operations:

- `ge okf compile --from spec --to bundle --spec <path> --out <okf-dir>` compiles the current build contract into an OKF bundle.
- `ge okf compile --from bundle --to spec --bundle <okf-dir> --out <spec.json>` compiles OKF back into a generation-spec-compatible object.
- `ge okf audit <bundle> [--json] [--strict]` reports base conformance, navigability, semantic coverage, behavioral coverage, and consumption readiness.
- `ge okf graph <bundle> [--json] [--format cytoscape]` extracts concept nodes and section-inferred edges.
- `ge okf explain <concept-id> --bundle <bundle> [--json]` renders authority, backlinks, proof, risk, and citation context.
- `ge okf diff <left> <right> [--json]` emits a machine-readable round-trip diff summary.
- `ge okf repair <bundle> [--dry-run]` conservatively proposes missing indexes/logs without fabricating citations or authority.

GE profile concept types include Agent, Enterprise Agent Contract, Capability, Query Capability, Workflow, Source System, Tool, Entity, Field, Document, Policy, Claim, Evidence, Eval, Synthetic World, Persona, Risk, Reference, Bench Profile, Proof Obligation, and Promotion Gate.
