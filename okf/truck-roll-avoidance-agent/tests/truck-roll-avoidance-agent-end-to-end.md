---
type: Eval Scenario
title: Run the Truck Roll Avoidance Agent workflow for the current period. Cite the ...
description: "Run the Truck Roll Avoidance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "truck-roll-avoidance-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Truck Roll Avoidance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_oracle_field_service_field_work_orders](/tools/query-oracle-field-service-field-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_truck_roll_avoidance_agent_assurance_runbook](/tools/lookup-truck-roll-avoidance-agent-assurance-runbook.md)
- [action_oracle_field_service_file](/tools/action-oracle-field-service-file.md)

## Success rubric

Action file executed against Oracle Field Service, with audit-trail entry and Field Operations Supervisor notified of outcomes.

# Citations

- [Truck Roll Avoidance Agent Service Assurance Runbook](/documents/truck-roll-avoidance-agent-assurance-runbook.md)
