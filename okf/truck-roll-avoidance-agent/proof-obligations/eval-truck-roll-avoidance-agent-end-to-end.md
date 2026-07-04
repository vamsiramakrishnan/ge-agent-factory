---
type: Proof Obligation
title: "Golden eval obligation — Run the Truck Roll Avoidance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-truck-roll-avoidance-agent-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Truck Roll Avoidance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [truck-roll-avoidance-agent-end-to-end](/tests/truck-roll-avoidance-agent-end-to-end.md)


## Mechanisms

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_truck_roll_avoidance_agent_assurance_runbook](/tools/lookup-truck-roll-avoidance-agent-assurance-runbook.md)
- [action_oracle_field_service_file](/tools/action-oracle-field-service-file.md)

## Entities that must be referenced

- field_work_orders
- analytics_events
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [truck-roll-avoidance-agent-assurance-runbook](/documents/truck-roll-avoidance-agent-assurance-runbook.md)
