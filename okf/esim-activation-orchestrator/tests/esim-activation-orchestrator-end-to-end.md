---
type: Eval Scenario
title: Run the eSIM Activation Orchestrator workflow for the current period. Cite th...
description: "Run the eSIM Activation Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "esim-activation-orchestrator-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the eSIM Activation Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_file](/tools/action-netcracker-service-orchestration-file.md)

## Success rubric

Action file executed against Netcracker Service Orchestration, with audit-trail entry and Provisioning Engineer notified of outcomes.

# Citations

- [eSIM Activation Orchestrator Service Assurance Runbook](/documents/esim-activation-orchestrator-assurance-runbook.md)
