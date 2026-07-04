---
type: Agent Tool
title: query_sphera_ehs_permit_records
description: Retrieve permit records from Sphera EHS for the Energy Intensity Monitoring Engine workflow.
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

# query_sphera_ehs_permit_records

Retrieve permit records from Sphera EHS for the Energy Intensity Monitoring Engine workflow.

- **Kind:** query
- **Source system:** [Sphera EHS](/systems/sphera-ehs.md)

## Inputs

- permit_number
- date_range

## Outputs

- permit_records_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Sphera EHS](/systems/sphera-ehs.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- permit_number
- date_range

## Produces

- permit_records_records

# Examples

```
query_sphera_ehs_permit_records(permit_number=<permit_number>, date_range=<date_range>)
```

# Citations

- [Sphera EHS](/systems/sphera-ehs.md)
