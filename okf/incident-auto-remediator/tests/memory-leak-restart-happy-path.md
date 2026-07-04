---
type: Eval Scenario
title: "PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. La..."
description: "PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. Last deployment was 3 days ago. Datadog shows gradual memory growth over 6 hours. Recommend and execute restart after SRE approval."
source_id: "memory-leak-restart-happy-path"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. Last deployment was 3 days ago. Datadog shows gradual memory growth over 6 hours. Recommend and execute restart after SRE approval.

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
- [action_kubernetes_restart_pod](/tools/action-kubernetes-restart-pod.md)
- [action_pagerduty_update_incident](/tools/action-pagerduty-update-incident.md)

## Success rubric

Restart approved and executed; pod health restored; incident marked resolved in PagerDuty with runbook citation.

# Citations

- [SRE Runbook Library](/documents/sre-runbook-library.md)
- [Production Change Approval Policy](/documents/production-change-approval-policy.md)
