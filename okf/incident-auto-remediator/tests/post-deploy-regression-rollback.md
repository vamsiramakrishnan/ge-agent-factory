---
type: Eval Scenario
title: "PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 ..."
description: "PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval."
source_id: "post-deploy-regression-rollback"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval.

## Validates

- [execution-verification](/queries/execution-verification.md)

## Mechanisms to call

- [query_pagerduty_active_incidents](/tools/query-pagerduty-active-incidents.md)
- [query_datadog_apm_traces](/tools/query-datadog-apm-traces.md)
- [query_datadog_metrics](/tools/query-datadog-metrics.md)
- [query_kubernetes_pod_status](/tools/query-kubernetes-pod-status.md)
- [query_terraform_state](/tools/query-terraform-state.md)
- [query_bigquery_runbook_history](/tools/query-bigquery-runbook-history.md)
- [evidence_runbook_library](/tools/evidence-runbook-library.md)
- [action_kubernetes_rollback_deployment](/tools/action-kubernetes-rollback-deployment.md)
- [action_pagerduty_update_incident](/tools/action-pagerduty-update-incident.md)

## Success rubric

Rollback to v2.14.5 approved and executed; error rate recovered; incident resolved.

# Citations

- [SRE Runbook Library](/documents/sre-runbook-library.md)
- [Production Change Approval Policy](/documents/production-change-approval-policy.md)
