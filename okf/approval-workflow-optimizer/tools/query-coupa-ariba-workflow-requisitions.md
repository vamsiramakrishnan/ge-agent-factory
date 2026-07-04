---
type: Agent Tool
title: query_coupa_ariba_workflow_requisitions
description: Retrieve requisitions from Coupa/Ariba Workflow for the Approval Workflow Optimizer workflow.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_coupa_ariba_workflow_requisitions

Retrieve requisitions from Coupa/Ariba Workflow for the Approval Workflow Optimizer workflow.

- **Kind:** query
- **Source system:** [Coupa/Ariba Workflow](/systems/coupa-ariba-workflow.md)

## Inputs

- lookup_key
- date_range

## Outputs

- requisitions_records
- requisitions_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Coupa/Ariba Workflow](/systems/coupa-ariba-workflow.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [workflow_data_extraction](/workflow/workflow-data-extraction.md)

## Evals

- [Run the Approval Workflow Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/approval-workflow-optimizer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- requisitions_records
- requisitions_summary

# Examples

```
query_coupa_ariba_workflow_requisitions(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Coupa/Ariba Workflow](/systems/coupa-ariba-workflow.md)
