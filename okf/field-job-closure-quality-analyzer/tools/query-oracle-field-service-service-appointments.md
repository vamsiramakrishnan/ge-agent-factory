---
type: Agent Tool
title: query_oracle_field_service_service_appointments
description: Retrieve service appointments from Oracle Field Service for the Field Job Closure Quality Analyzer workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_oracle_field_service_service_appointments

Retrieve service appointments from Oracle Field Service for the Field Job Closure Quality Analyzer workflow.

- **Kind:** query
- **Source system:** [Oracle Field Service](/systems/oracle-field-service.md)

## Inputs

- appointment_id
- work_order_number
- date_range

## Outputs

- service_appointments_records

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle Field Service](/systems/oracle-field-service.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- source_system_record

## Required inputs

- appointment_id
- work_order_number
- date_range

## Produces

- service_appointments_records

# Examples

```
query_oracle_field_service_service_appointments(appointment_id=<appointment_id>, work_order_number=<work_order_number>, date_range=<date_range>)
```

# Citations

- [Oracle Field Service](/systems/oracle-field-service.md)
