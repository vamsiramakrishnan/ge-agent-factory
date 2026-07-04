---
type: Query Capability
title: "Receive alert from PagerDuty. Correlate with related alerts (deduplication), ..."
description: "Receive alert from PagerDuty. Correlate with related alerts (deduplication), recent deployments, and infrastructure events. Pull service context from Datadog APM."
source_id: "alert-intake-correlation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive alert from PagerDuty. Correlate with related alerts (deduplication), recent deployments, and infrastructure events. Pull service context from Datadog APM.

## Tools used

- [query_pagerduty_active_incidents](/tools/query-pagerduty-active-incidents.md)
- [query_datadog_apm_traces](/tools/query-datadog-apm-traces.md)
- [query_datadog_metrics](/tools/query-datadog-metrics.md)
- [action_kubernetes_rollback_deployment](/tools/action-kubernetes-rollback-deployment.md)
- [action_pagerduty_update_incident](/tools/action-pagerduty-update-incident.md)

## Runs in

- [alert_intake_correlation](/workflow/alert-intake-correlation.md)

## Evidence expected

- source_system_record
- api_response

## Evals

- [PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. Last deployment was 3 days ago. Datadog shows gradual memory growth over 6 hours. Recommend and execute restart after SRE approval.](/tests/memory-leak-restart-happy-path.md)
- [PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval.](/tests/post-deploy-regression-rollback.md)
- [PagerDuty alert INC-0044: Database connection pool exhaustion, Sev-1. No matching runbook. Request SRE Manager assessment.](/tests/sev1-escalation-no-auto-action.md)

# Citations

- [SRE Runbook Library](/documents/sre-runbook-library.md)
- [Production Change Approval Policy](/documents/production-change-approval-policy.md)
