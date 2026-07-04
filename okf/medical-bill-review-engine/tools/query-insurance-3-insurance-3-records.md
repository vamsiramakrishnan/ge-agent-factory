---
type: Agent Tool
title: query_insurance_3_insurance_3_records
description: Retrieve insurance 3 records from INSURANCE 3 for the Medical Bill Review Engine workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_insurance_3_insurance_3_records

Retrieve insurance 3 records from INSURANCE 3 for the Medical Bill Review Engine workflow.

- **Kind:** query
- **Source system:** [INSURANCE 3](/systems/insurance-3.md)

## Inputs

- lookup_key
- date_range

## Outputs

- insurance_3_records_records
- insurance_3_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [INSURANCE 3](/systems/insurance-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)

## Evals

- [Run the Medical Bill Review Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/medical-bill-review-engine-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- insurance_3_records_records
- insurance_3_records_summary

# Examples

```
query_insurance_3_insurance_3_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [INSURANCE 3](/systems/insurance-3.md)
