---
type: Workflow Stage
title: "Cross-System State Reconciliation"
description: "Cross-check service_orders and network_inventory_items from Netcracker Service Orchestration against analytics_events and historical_metrics surfaced by query_bigquery_analytics_events to confirm HSS, entitlement, and billing agree before an activation is called done."
source_id: cross_system_state_reconciliation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cross-System State Reconciliation

Cross-check service_orders and network_inventory_items from Netcracker Service Orchestration against analytics_events and historical_metrics surfaced by query_bigquery_analytics_events to confirm HSS, entitlement, and billing agree before an activation is called done.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_file](/tools/action-netcracker-service-orchestration-file.md)

Next: [Fallout Severity Scoring & Runbook Validation](/workflow/fallout-severity-scoring-runbook-validation.md)
