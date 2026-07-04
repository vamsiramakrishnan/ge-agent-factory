---
type: Agent Tool
title: query_oracle_field_service_field_work_orders
description: Retrieve field work orders from Oracle Field Service for the Fiber Build Permitting Agent workflow.
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

Retrieve field work orders from Oracle Field Service for the Fiber Build Permitting Agent workflow.

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

- [permit_gated_work_order_triage](/workflow/permit-gated-work-order-triage.md)
- [crew_locate_readiness_check](/workflow/crew-locate-readiness-check.md)
- [escalate_stalled_permits_audit](/workflow/escalate-stalled-permits-audit.md)

## Evals

- [Run the Fiber Build Permitting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fiber-build-permitting-agent-end-to-end.md)
- [Work order 34518822 at premise_id 4471203 is queued for install_fiber excavation with dispatch_date 2026-07-08. The 811 locate ticket for that site expires 2026-07-06, and there's an open ServiceNow change_request (CHG0091422, priority P2) for concurrent water-main work at the same premise. Prepare the permit resubmission and confirm we're clear to dig.](/tests/fiber-build-permitting-agent-locate-expiry-conflict.md)
- [Cross-check work order 31029744 at premise_id 2280564 — it's been sitting in permit review for 52 days, past the 45-day jurisdiction SLA baseline in BigQuery historical_metrics, and the linked ServiceNow ticket shows sla_met=false. Decide whether to escalate or keep chasing the jurisdiction ourselves.](/tests/fiber-build-permitting-agent-sla-aging-reconciliation.md)

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
