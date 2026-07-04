---
type: Agent Tool
title: query_workday_employees
description: Retrieve employees from Workday for the Compensation Letter Generator workflow.
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

# query_workday_employees

Retrieve employees from Workday for the Compensation Letter Generator workflow.

- **Kind:** query
- **Source system:** [Workday](/systems/workday.md)

## Inputs

- lookup_key
- date_range

## Outputs

- employees_records
- employees_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Workday](/systems/workday.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [compensation_data_pull](/workflow/compensation-data-pull.md)

## Evals

- [Run the Compensation Letter Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compensation-letter-generator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- employees_records
- employees_summary

# Examples

```
query_workday_employees(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Workday](/systems/workday.md)
