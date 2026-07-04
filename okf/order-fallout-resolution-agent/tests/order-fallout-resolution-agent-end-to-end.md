---
type: Eval Scenario
title: Run the Order Fallout Resolution Agent workflow for the current period. Cite ...
description: "Run the Order Fallout Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "order-fallout-resolution-agent-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Order Fallout Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [fallout-queue-intake-correlation](/queries/fallout-queue-intake-correlation.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_order_fallout_resolution_agent_assurance_runbook](/tools/lookup-order-fallout-resolution-agent-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

## Success rubric

Action escalate executed against Netcracker Service Orchestration, with audit-trail entry and Order Management Specialist notified of outcomes.

# Citations

- [Order Fallout Resolution Agent Service Assurance Runbook](/documents/order-fallout-resolution-agent-assurance-runbook.md)
