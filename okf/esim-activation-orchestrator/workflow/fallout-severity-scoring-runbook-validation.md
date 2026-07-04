---
type: Workflow Stage
title: "Fallout Severity Scoring & Runbook Validation"
description: "Score fallout_status and task_status severity against BigQuery historical baselines, then validate every finding against the eSIM Activation Orchestrator Service Assurance Runbook citation anchors via lookup_esim_activation_orchestrator_assurance_runbook."
source_id: fallout_severity_scoring_runbook_validation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Fallout Severity Scoring & Runbook Validation

Score fallout_status and task_status severity against BigQuery historical baselines, then validate every finding against the eSIM Activation Orchestrator Service Assurance Runbook citation anchors via lookup_esim_activation_orchestrator_assurance_runbook.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_esim_activation_orchestrator_assurance_runbook](/tools/lookup-esim-activation-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_file](/tools/action-netcracker-service-orchestration-file.md)

Next: [Guarded Retry & Provisioning Action](/workflow/guarded-retry-provisioning-action.md)
