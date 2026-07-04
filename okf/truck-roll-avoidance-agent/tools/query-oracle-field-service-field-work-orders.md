---
type: Agent Tool
title: query_oracle_field_service_field_work_orders
description: Retrieve field work orders from Oracle Field Service for the Truck Roll Avoidance Agent workflow.
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

Retrieve field work orders from Oracle Field Service for the Truck Roll Avoidance Agent workflow.

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

- [ticket_to_work_order_correlation](/workflow/ticket-to-work-order-correlation.md)
- [remote_diagnostic_battery](/workflow/remote-diagnostic-battery.md)
- [no_fault_found_risk_scoring](/workflow/no-fault-found-risk-scoring.md)
- [runbook_gated_remediation_decision](/workflow/runbook-gated-remediation-decision.md)
- [dispatch_filing_technician_brief](/workflow/dispatch-filing-technician-brief.md)

## Evals

- [Run the Truck Roll Avoidance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/truck-roll-avoidance-agent-end-to-end.md)
- [Work order WO-34418902 (premise 5521187) has Zendesk ticket #88214 opened 2026-07-02 reporting an intermittent drop, priority P2. The last BigQuery analytics_events line-diagnostic reading for this premise is dated 2026-06-29 (five days old) and shows a passing provisioning check, but the field_work_orders record shows repeat_within_30d=true with truck_rolls already at 2 for this premise. Decide whether to close this remotely or dispatch, and file the disposition.](/tests/truck-roll-avoidance-agent-stale-diagnostic-conflict.md)
- [Work order WO-34477215 (premise 6603341, work_type=install_fixed_wireless) needs a tower crew for antenna work. The only technician_schedules record available in the am_8_12 window at west_garage has primary_skill=cpe_advanced and tower_climb_certified=false. materials_cost_usd on the work order is quoted at $812.40, and the customer's service_appointments record already shows reschedule_count=2. Assign the job and file the dispatch.](/tests/truck-roll-avoidance-agent-skill-mismatch-cost-edge.md)

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
