---
type: Agent Tool
title: query_adp_adp_records
description: Retrieve adp records from ADP for the Payroll Input Validation workflow.
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

# query_adp_adp_records

Retrieve adp records from ADP for the Payroll Input Validation workflow.

- **Kind:** query
- **Source system:** [ADP](/systems/adp.md)

## Inputs

- lookup_key
- date_range

## Outputs

- adp_records_records
- adp_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [ADP](/systems/adp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [payroll_data_aggregation](/workflow/payroll-data-aggregation.md)

## Evals

- [Run the Payroll Input Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payroll-input-validation-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- adp_records_records
- adp_records_summary

# Examples

```
query_adp_adp_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [ADP](/systems/adp.md)
