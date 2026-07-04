---
type: Agent Tool
title: query_oracle_field_service_field_work_orders
description: Retrieve field work orders from Oracle Field Service for the Tower Maintenance Scheduling Engine workflow.
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

# query_oracle_field_service_field_work_orders

Retrieve field work orders from Oracle Field Service for the Tower Maintenance Scheduling Engine workflow.

- **Kind:** query
- **Source system:** [Oracle Field Service](/systems/oracle-field-service.md)

## Inputs

- work_order_number
- premise_id
- date_range

## Outputs

- field_work_orders_records
- field_work_orders_summary

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

- [site_alarm_intake](/workflow/site-alarm-intake.md)
- [crew_visit_bundling](/workflow/crew-visit-bundling.md)
- [power_degradation_triage](/workflow/power-degradation-triage.md)
- [runbook_gate_dispatch](/workflow/runbook-gate-dispatch.md)

## Evals

- [Run the Tower Maintenance Scheduling Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tower-maintenance-scheduling-engine-end-to-end.md)
- [Work order 30481022 at premise 4417290 shows wo_status='completed' for site_maintenance (battery/backup power service) dispatched on 2026-06-18, but Splunk shows a new P1 alert_actions record raised on 2026-06-19 for the same tower cabinet, after the work order closed. Before I count this site toward this quarter's preventive maintenance compliance number, tell me whether the fix actually held.](/tests/tower-maintenance-scheduling-engine-completed-wo-open-alarm.md)

## Evidence emitted

- source_system_record

## Required inputs

- work_order_number
- premise_id
- date_range

## Produces

- field_work_orders_records
- field_work_orders_summary

# Examples

```
query_oracle_field_service_field_work_orders(work_order_number=<work_order_number>, premise_id=<premise_id>, date_range=<date_range>)
```

# Citations

- [Oracle Field Service](/systems/oracle-field-service.md)
