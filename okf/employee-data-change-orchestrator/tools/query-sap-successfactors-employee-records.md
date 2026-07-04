---
type: Agent Tool
title: query_sap_successfactors_employee_records
description: Retrieve employee records from SAP SuccessFactors for the Employee Data Change Orchestrator workflow.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sap_successfactors_employee_records

Retrieve employee records from SAP SuccessFactors for the Employee Data Change Orchestrator workflow.

- **Kind:** query
- **Source system:** [SAP SuccessFactors](/systems/sap-successfactors.md)

## Inputs

- lookup_key
- date_range

## Outputs

- employee_records_records
- employee_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP SuccessFactors](/systems/sap-successfactors.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [change_detection](/workflow/change-detection.md)

## Evals

- [Run the Employee Data Change Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/employee-data-change-orchestrator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- employee_records_records
- employee_records_summary

# Examples

```
query_sap_successfactors_employee_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP SuccessFactors](/systems/sap-successfactors.md)
