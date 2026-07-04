---
type: Eval Scenario
title: "Order 74215560 (enterprise, port_in) has shown fallout_status = inventory_sho..."
description: "Order 74215560 (enterprise, port_in) has shown fallout_status = inventory_shortfall in Netcracker Service Orchestration since Monday, but ServiceNow ticket INC0043211 tied to it was marked resolved yesterday afternoon. The latest inventory_shortfall baseline in BigQuery analytics_events was computed 30 hours ago. Reconcile the discrepancy and tell me whether it's safe to escalate this order for manual dispatch."
source_id: "order-fallout-resolution-agent-stale-evidence-reconciliation"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Order 74215560 (enterprise, port_in) has shown fallout_status = inventory_shortfall in Netcracker Service Orchestration since Monday, but ServiceNow ticket INC0043211 tied to it was marked resolved yesterday afternoon. The latest inventory_shortfall baseline in BigQuery analytics_events was computed 30 hours ago. Reconcile the discrepancy and tell me whether it's safe to escalate this order for manual dispatch.

## Validates

- [fallout-queue-intake-correlation](/queries/fallout-queue-intake-correlation.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_order_fallout_resolution_agent_assurance_runbook](/tools/lookup-order-fallout-resolution-agent-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Order Fallout Resolution Agent Service Assurance Runbook](/documents/order-fallout-resolution-agent-assurance-runbook.md)
