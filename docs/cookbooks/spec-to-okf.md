---
title: Spec ⇄ OKF
parent: Cookbooks
nav_order: 5
layout: default
---

# Spec ⇄ OKF

## Goal

Convert a generated agent spec into a portable **OKF (Open Knowledge Format) v0.1**
Knowledge Bundle, inspect what's inside, and round-trip it back into a spec.

## Prerequisites

- Local toolchain installed (`make setup`).
- Either a use-case id present in the catalog
  (`generated/use-cases.generated.json` — produced by `make catalog`) or a spec
  JSON file on disk.

> Path note: the OKF scripts live under **`apps/factory/scripts/`**,
> not the top-level `scripts/`.

## Steps

1. **Convert a spec to an OKF bundle — by use-case id:**

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

2. **Inspect the bundle.** Each OKF concept is a markdown file with frontmatter
   `type`. The mapping (from the spec) is:

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

   (`documents/` appears only when the spec has source documents; `workflow/`,
   `queries/`, and `tests/` appear only when those sections are non-empty.)

3. **Round-trip back to a spec:**

   ```bash
   node apps/factory/scripts/okf-to-spec.mjs --bundle <dir>
   ```

   Flags: `--bundle <dir>` (required), `--help`. It prints a reconstructed
   partial spec (`behaviorContract` + `generationSpec.{sourceSystems,entities,
   documents,behaviorContract}`) to stdout.

4. **Author OKF directly (the skill).** The `authoring-okf-specs` skill (at
   `skills/authoring-okf-specs/SKILL.md`, composes `interviewing-specs`)
   documents the same commands and conventions for authoring or exchanging a BRD
   as an OKF bundle, and grounding an agent from one.

## Verify

```bash
# bundle produced with concepts:
node apps/factory/scripts/spec-to-okf.mjs --id <useCaseId>   # conceptCount > 0
ls apps/factory/artifacts/okf/<useCaseId>/                   # index.md, playbook.md, systems/, ...

# round-trip is parseable:
node apps/factory/scripts/okf-to-spec.mjs --bundle apps/factory/artifacts/okf/<useCaseId>/

# the converter has a test:
bun test apps/factory/scripts/spec-to-okf.test.mjs
```

## Troubleshoot

- **`Provide --id <useCaseId> or --spec <path.json>`** — you passed neither;
  they're mutually exclusive and one is required.
- **`--id` can't find the spec** — run `make catalog` to (re)generate
  `generated/use-cases.generated.json`, or use `--spec <path.json>` directly.
- **Missing `workflow/` or `queries/` concepts** — the source spec has no
  `behaviorContract.workflow.steps` / answerable queries. Re-author via the
  [interview](author-a-spec-via-interview.html) (which emits both).
