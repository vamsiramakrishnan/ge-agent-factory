---
title: OKF export & run controls
parent: Console
nav_order: 6
layout: default
description: How OKF export and existing console run controls fit together.
---

# OKF export & run controls

The console does not introduce separate **OKF** or **GE Drive** sidebar views.
Instead, OKF is an export/review affordance tied to the contract, and run-driving
uses the existing **Pipeline**, **Runs**, and **Agent detail** surfaces. This
page documents that integration as implemented in the current UI.

<p align="center">
  <img src="../assets/diagrams/console-okf-drive-views.svg" alt="Operator intent enters the Interview view, flows through Spec Review and OKF export, continues through Pipeline and Runs, opens Agent detail proof views, and reaches the promotion gate before handoff to agents-cli, ADK, and Gemini Enterprise" width="860">
</p>

## OKF export

OKF belongs next to **Spec Review** because it is the portable knowledge form of
the same reviewed contract, not a second source of truth. The contract review
flow should make these questions answerable before an operator regenerates an
agent:

| Question | Console affordance |
|---|---|
| What contract is this OKF bundle tied to? | Spec identity, version, department, use case, and contract diff context |
| What knowledge is grounded? | Source files, extracted concepts, and coverage by capability or workflow step |
| What is ready to export? | OKF bundle status, file list, and generated knowledge artifacts |
| What still needs review? | Missing source references, thin concepts, or contract fields that do not map cleanly |

The important invariant is contract-first ownership: edits happen in the
contract review surface; OKF export reflects that reviewed state.

## Existing run controls

The browser run loop is the same operator loop you run from a terminal with
commands such as `ge prove` and `ge agents build`, but it is surfaced through
existing console areas:

- **Pipeline** chooses or previews the next build action for a use case.
- **Runs** follows the durable run ledger, including stage progress, blocked
  reasons, and log follow.
- **Agent detail** exposes generated files, ADK preview, eval output, and
  proof-pack artifacts after a run produces them.
- **Readiness** checks whether the environment can safely execute the next
  mutating step.

That split avoids a console-only command surface: the UI describes and follows
the same `ge` operations rather than inventing a separate GE Drive view.

## Integration contract

| Area | Must show | Must not do |
|---|---|---|
| OKF export | Contract identity, bundle status, concepts, source files, export action | Let OKF silently diverge from the reviewed contract |
| Pipeline / Runs | Command context, stage target, live follow, blockers, artifact links | Hide the underlying factory operation or invent console-only behavior |
| Proof | Eval verdicts, validation artifacts, proof-pack location | Treat a green UI state as proof without artifacts |

## Relationship to the rest of the console

- **Interview** captures intent and supporting documents.
- **Spec Review** edits and approves the Enterprise Agent Contract.
- **OKF export** packages the reviewed contract's knowledge context.
- **Pipeline** starts the factory action for that contract and OKF bundle.
- **Runs** records the run ledger and live follow stream.
- **Agent detail** exposes generated files, preview, evals, and proof.
- **Readiness** checks whether the environment can safely run the next mutating step.

Together, these areas make the console an operator cockpit over the same engine
as the CLI, not a parallel implementation.
