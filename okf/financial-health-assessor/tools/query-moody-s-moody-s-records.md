---
type: Agent Tool
title: query_moody_s_moody_s_records
description: "Retrieve moody s records from Moody's for the Financial Health Assessor workflow."
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

# query_moody_s_moody_s_records

Retrieve moody s records from Moody's for the Financial Health Assessor workflow.

- **Kind:** query
- **Source system:** [Moody's](/systems/moody-s.md)

## Inputs

- lookup_key
- date_range

## Outputs

- moody_s_records_records
- moody_s_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Moody's](/systems/moody-s.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [financial_data_aggregation](/workflow/financial-data-aggregation.md)

## Evals

- [Run the Financial Health Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/financial-health-assessor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- moody_s_records_records
- moody_s_records_summary

# Examples

```
query_moody_s_moody_s_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Moody's](/systems/moody-s.md)
