---
type: Eval Scenario
title: Run the Legacy Service Migration Orchestrator workflow for the current period...
description: "Run the Legacy Service Migration Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "legacy-service-migration-orchestrator-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Legacy Service Migration Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_legacy_service_migration_orchestrator_assurance_runbook](/tools/lookup-legacy-service-migration-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)

## Success rubric

Action escalate executed against Netcracker Service Orchestration, with audit-trail entry and Provisioning Engineer notified of outcomes.

# Citations

- [Legacy Service Migration Orchestrator Service Assurance Runbook](/documents/legacy-service-migration-orchestrator-assurance-runbook.md)
