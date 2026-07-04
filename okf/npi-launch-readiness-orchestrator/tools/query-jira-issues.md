---
type: Agent Tool
title: query_jira_issues
description: Retrieve issues from Jira for the NPI Launch Readiness Orchestrator workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_jira_issues

Retrieve issues from Jira for the NPI Launch Readiness Orchestrator workflow.

- **Kind:** query
- **Source system:** [Jira](/systems/jira.md)

## Inputs

- lookup_key
- date_range

## Outputs

- issues_records
- issues_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Jira](/systems/jira.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [gate_deliverable_reconciliation](/workflow/gate-deliverable-reconciliation.md)
- [critical_path_escalation](/workflow/critical-path-escalation.md)
- [gate_review_readiness_pack_compilation](/workflow/gate-review-readiness-pack-compilation.md)

## Evals

- [Run the NPI Launch Readiness Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/npi-launch-readiness-orchestrator-end-to-end.md)
- [Gate review for Program Falcon-7 is in 9 days. Jira issue NPI-4821 (linked to ECO-24417, owner Priya Raghunathan) shows status 'closed' with a note that the drawing package is done. But PTC Windchill CAD document 8341206 rev C tied to that ECO still shows lifecycle_state 'in_review' and checked_out=true as of this morning. The program office wants this deliverable marked green in tomorrow's readiness pack. Should it be?](/tests/npi-launch-readiness-orchestrator-status-mismatch-gate.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- issues_records
- issues_summary

# Examples

```
query_jira_issues(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Jira](/systems/jira.md)
