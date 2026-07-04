---
type: Workflow Stage
title: "Post-Cutover Health Verification & Rollback"
description: "Monitor analytics_events and historical_metrics in BigQuery for circuit health after cutover, and execute action_netcracker_service_orchestration_escalate to roll back or hand off any circuit that fails verification to the Provisioning Engineer."
source_id: post_cutover_health_verification_rollback
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Post-Cutover Health Verification & Rollback

Monitor analytics_events and historical_metrics in BigQuery for circuit health after cutover, and execute action_netcracker_service_orchestration_escalate to roll back or hand off any circuit that fails verification to the Provisioning Engineer.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_netcracker_service_orchestration_service_orders](/tools/query-netcracker-service-orchestration-service-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_legacy_service_migration_orchestrator_assurance_runbook](/tools/lookup-legacy-service-migration-orchestrator-assurance-runbook.md)
- [action_netcracker_service_orchestration_escalate](/tools/action-netcracker-service-orchestration-escalate.md)
