---
type: Proof Obligation
title: "Golden eval obligation — PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval."
description: golden eval proof obligation
source_id: "eval-post-deploy-regression-rollback"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.1
generation_status: generated
ge_status: generated
---

# Golden eval obligation — PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.1
- **Eval:** [post-deploy-regression-rollback](/tests/post-deploy-regression-rollback.md)


## Mechanisms

- [query_pagerduty_active_incidents](/tools/query-pagerduty-active-incidents.md)
- [query_datadog_apm_traces](/tools/query-datadog-apm-traces.md)
- [query_datadog_metrics](/tools/query-datadog-metrics.md)
- [query_kubernetes_pod_status](/tools/query-kubernetes-pod-status.md)
- [query_terraform_state](/tools/query-terraform-state.md)
- [query_bigquery_runbook_history](/tools/query-bigquery-runbook-history.md)
- [evidence_runbook_library](/tools/evidence-runbook-library.md)
- [action_kubernetes_rollback_deployment](/tools/action-kubernetes-rollback-deployment.md)
- [action_pagerduty_update_incident](/tools/action-pagerduty-update-incident.md)

## Forbidden behaviors

- do not recommend restart for post-deploy regression
- do not invent rollback target version

# Citations

- [sre-runbook-library](/documents/sre-runbook-library.md)
- [production-change-approval-policy](/documents/production-change-approval-policy.md)
