---
type: Agent Tool
title: query_ukg_dimensions_timecards
description: Retrieve timecards from UKG Dimensions for the DC Labor Planning Engine workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ukg_dimensions_timecards

Retrieve timecards from UKG Dimensions for the DC Labor Planning Engine workflow.

- **Kind:** query
- **Source system:** [UKG Dimensions](/systems/ukg-dimensions.md)

## Inputs

- employee_id
- store_number
- date_range

## Outputs

- timecards_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [UKG Dimensions](/systems/ukg-dimensions.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- employee_id
- store_number
- date_range

## Produces

- timecards_records

# Examples

```
query_ukg_dimensions_timecards(employee_id=<employee_id>, store_number=<store_number>, date_range=<date_range>)
```

# Citations

- [UKG Dimensions](/systems/ukg-dimensions.md)
