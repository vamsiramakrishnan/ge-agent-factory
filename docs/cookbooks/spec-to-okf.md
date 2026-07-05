---
title: Contract ⇄ OKF
parent: Guides
nav_order: 5
layout: default
description: Convert a contract to its portable Markdown form — an OKF Knowledge Bundle — and round-trip it back.
---

# Contract ⇄ OKF

**Scope:** local-only — file in, file out; no daemon or cloud needed.

## When to use this

The OKF (Open Knowledge Format) v0.1 Knowledge Bundle is the contract's
**portable Markdown form**: the same use-case spec, rendered as a directory of
typed Markdown concepts that humans can review in a pull request, exchange
with other teams, or hand to tools that read Markdown rather than the spec's
JSON. Use this guide to convert a contract into an OKF bundle, inspect what's
inside, and round-trip it back into a spec.

<p align="center">
  <img src="../assets/diagrams/okf-spine.svg" alt="The OKF spine: an interview produces a spec in OKF form, which drives generation of real ADK code, validation, tests derived from the contract, and runtime grounding where the agent cites the same systems and entities" width="750">
</p>

## Input artifact

Either a use-case id present in the catalog
(`generated/use-cases.generated.json` — produced by `mise run catalog`) or a
contract JSON file on disk (for example the interview's saved
`.ge/interviews/<usecaseId>/agent-spec.json`). Local toolchain installed
(`mise run setup`).

> The OKF scripts live under **`apps/factory/scripts/`**, not the top-level
> `scripts/`.
{: .note }

## Steps

1. **Convert a contract to an OKF bundle — by use-case id:**

   ```bash
   node apps/factory/scripts/spec-to-okf.mjs --id <useCaseId>
   ```

   **or from a spec file:**

   ```bash
   node apps/factory/scripts/spec-to-okf.mjs --spec <path.json>
   ```

   Flags (exactly four): `--id <useCaseId>` *or* `--spec <path.json>` (one
   required, mutually exclusive), `--out <dir>` (default
   `apps/factory/artifacts/okf/<id>/`), `--help`. The command prints
   `{ bundle, conceptCount, files }`.

2. **Inspect the bundle.** Each OKF concept is a Markdown file with
   frontmatter `type`. The mapping (from the contract) is:

   | Source | OKF concept |
   |--------|-------------|
   | `spec.{persona,subtitle,behaviorContract}` | `index.md` (Knowledge Bundle root, `okf_version`) |
   | generation history | `log.md` |
   | `behaviorContract.{role,scope,rules}` | `playbook.md` |
   | `generationSpec.sourceSystems[]` | `systems/<id>.md` (Source System) |
   | `generationSpec.entities[]` | `tables/<entity>.md` (Data Entity) |
   | `behaviorContract.toolIntents[]` | `tools/<name>.md` (Agent Tool) |
   | `behaviorContract.workflow.steps[]` | `workflow/<step>.md` (Workflow Stage) |
   | answerable queries | `queries/<id>.md` (Query Capability) |
   | derived test mechanisms | `tests/<id>.md` (Eval Scenario) |
   | `spec.kpis[]` | `kpis.md` |
   | `behaviorContract.goldenEvals[]` | `evals.md` |

   (`documents/` appears only when the contract has source documents;
   `workflow/`, `queries/`, and `tests/` appear only when those sections are
   non-empty.)

3. **Round-trip back to a spec:**

   ```bash
   node apps/factory/scripts/okf-to-spec.mjs --bundle <dir>
   ```

   Flags: `--bundle <dir>` (required), `--help`. It prints a reconstructed
   partial spec (`behaviorContract` + `generationSpec.{sourceSystems,entities,
   documents,behaviorContract}`) to stdout.

   > There is a known open bug in the round trip: certain tool/system ids are
   > mangled on the way back (tracked as failing tests in
   > [`tools/known-test-failures.json`](../../tools/known-test-failures.json)).
   > Treat the round-tripped spec as a reconstruction to review, not a
   > byte-faithful inverse.
   {: .warning }

4. **Author OKF directly (the skill).** The `authoring-okf-specs` skill (at
   `skills/authoring-okf-specs/SKILL.md`, composes `interviewing-specs`)
   documents the same commands and conventions for authoring or exchanging a
   BRD (Business Requirements Document) as an OKF bundle, and for grounding
   an agent from one.

## Expected output

```bash
# bundle produced with concepts:
node apps/factory/scripts/spec-to-okf.mjs --id <useCaseId>   # conceptCount > 0
ls apps/factory/artifacts/okf/<useCaseId>/                   # index.md, playbook.md, systems/, ...

# round-trip is parseable:
node apps/factory/scripts/okf-to-spec.mjs --bundle apps/factory/artifacts/okf/<useCaseId>/

# the converter has a test:
bun test apps/factory/scripts/spec-to-okf.test.mjs
```

## Console view

The same bundle is served in-process by `GET /api/interviews/:id/okf` for a
saved interview contract, and the contract itself is reviewed in **Spec
Review**. See the [contract editor](../console/contract-editor.html) and the
[console tour](../console/index.html).

## Generated files

`apps/factory/artifacts/okf/<id>/` (or `--out <dir>`): `index.md`, `log.md`,
`playbook.md`, `kpis.md`, `evals.md`, plus `systems/`, `tables/`, `tools/`,
and — when the contract carries them — `workflow/`, `queries/`, `tests/`,
`documents/`. Format details: [OKF reference](../reference/okf.html).

## Common failures

- **`Provide --id <useCaseId> or --spec <path.json>`** — you passed neither;
  they're mutually exclusive and one is required.
- **`--id` can't find the contract** — the catalog
  (`generated/use-cases.generated.json`) is stale or missing.
- **Missing `workflow/` or `queries/` concepts** — the source contract has no
  `behaviorContract.workflow.steps` / answerable queries.
- **A spec field vanishes through the round trip** — the converters only
  render/parse fields they know about.

## Repair

- Stale catalog: run `mise run catalog` to (re)generate it, or bypass it with
  `--spec <path.json>`.
- Missing workflow/queries: re-capture via the
  [interview](capture-from-interview.html), which emits both.
- Vanishing field: a new spec field must be threaded through both converters
  (and the rest of the duck-typed consumer set) — see
  [Adding a new spec field — the consumer checklist](../reference/spec-schema.html#adding-a-new-spec-field--the-consumer-checklist).

## Next step

[Compile a contract](compile-a-contract.html) to turn the contract into a
runnable agent — the compiler emits this same OKF bundle into the generated
workspace.
