---
title: Specs and OKF
parent: Concepts
nav_order: 2
layout: default
---

# Specs and OKF

The single most important idea in the factory is that **the spec is the
knowledge contract**. Everything downstream — generation, validation, evals,
runtime grounding — reads from one normalized description of the agent. If it is
not in the spec, it is not in the agent; and any line of generated code traces
back to a spec intent.

## The two halves of a spec

A use-case spec (`usecase-spec.json` in a workspace) has two complementary parts:

- **`generationSpec`** — the *world* the agent works in: the **source systems** it
  talks to, the **entities** (tables/objects) each system owns, and the data
  contract for those entities. This is what makes the agent's data behave like
  Workday / Ariba / SAP rather than toy JSON.
- **`behaviorContract`** — the *behavior* of the agent: its **role** and
  **objective**, what is **in / out of scope**, its **rules** and guardrails, the
  **tool intents** it may use, and — critically — a **`workflow`**: an ordered set
  of steps, each referencing the tool intents it uses.

Later additions enrich the contract so the spec is *self-describing* and
*testable*:

- **`workflow`** is what lets the factory derive a **multi-agent topology** instead
  of a single flat prompt (see below, and
  [Agents and ADK](./agents-and-adk.html)).
- **answerable queries** — the questions the agent should be able to answer,
  derived from the systems/entities — so the spec states its own capabilities.
- **tests / golden evals** — the mechanisms that prove the agent does what the
  spec says, so validation is grounded in the contract rather than invented.

## The workflow is the spine

The `behaviorContract.workflow` is the join between *what the business described*
and *what the factory builds*. It is computed in exactly one place,
[`scripts/factory/agent-workflow.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory),
shared by two consumers so authoring and build can never drift:

<p align="center">
  <img src="../assets/diagrams/workflow-spine.svg" alt="architecture.pipeline feeds matchPipelineSteps(), which both spec generation and build consume" width="550">
</p>

At **authoring time** the workflow steps carry tool-*intent* names (the names on
`behaviorContract.toolIntents`). At **build time** the generator resolves those
intents to **canonical Python tool names** against the materialized tables. A
pipeline only becomes a "real" multi-agent build when it has enough tool-bearing
stages and distinct tools (the thresholds live in the same module) — otherwise it
stays a single agent. This is how the factory avoids fabricating structure the
spec did not justify.

## OKF: the portable, authorable form of the spec

The factory's spec is rich JSON — great for machines, awkward for humans to
author, diff, or exchange. **[Open Knowledge Format (OKF)](https://openknowledge.foundation/)**
is the portable form: the same contract expressed as a directory of plain
Markdown **concepts** that any OKF consumer — or a person — can read, edit, and
version.

The converters are
[`scripts/spec-to-okf.mjs`](https://github.com/vamsiramakrishnan/ge-agent-factory)
and `scripts/okf-to-spec.mjs`, and the authoring guidance is the
[`authoring-okf-specs` skill](https://github.com/vamsiramakrishnan/ge-agent-factory).
The mapping (spec concept → OKF concept):

| Spec | OKF concept |
|---|---|
| `behaviorContract` (persona, role, scope, rules) | root `index.md` (Knowledge Bundle) + `playbook.md` (Playbook) |
| `generationSpec.sourceSystems[]` | `systems/<id>.md` (Source System) |
| `generationSpec.entities[]` | `tables/<entity>.md` (Data Entity) |
| `behaviorContract.toolIntents[]` | `tools/<name>.md` (Agent Tool) |
| `behaviorContract.workflow.steps[]` | `workflow/<step>.md` (Workflow Stage) |
| `kpis[]` / `goldenEvals[]` | `kpis.md` / `evals.md` |

OKF conformance is small and deliberate: every non-reserved `.md` has frontmatter
with a non-empty `type`; only the root `index.md` declares `okf_version: "0.1"`;
each directory has an `index.md` for progressive disclosure; relationships are
**bundle-absolute Markdown links** (`/systems/<id>.md`) — the link graph *is* the
relationship graph. The conversion is lossy-by-design on slugs (concept ids are
filesystem-safe) but **preserves tool names, system identities, and workflow
ordering**, so a bundle round-trips back into a partial spec the factory can
ingest. Consumers tolerate unknown types/keys and broken links.

## The spine, end to end

OKF is not a side export — it is the **portable spine of the whole pipeline**:

<p align="center">
  <img src="../assets/diagrams/okf-spine.svg" alt="interview to spec (OKF) to generate to validate to test to runtime grounding" width="800">
</p>

A hand-authored OKF bundle can re-enter the factory: ingest it back to a partial
spec, run it through the interview/normalize step to enrich and register it, then
the factory plans a build from it. So a BRD authored *outside* the factory and a
spec generated *inside* it are the same kind of object, just in different forms.

See the [Reference](../reference/) for the converter flags and the full spec
schema, and the [Cookbooks](../cookbooks/) for authoring and exchanging an OKF
bundle.
