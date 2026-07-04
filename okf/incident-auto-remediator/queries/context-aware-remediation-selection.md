---
type: Query Capability
title: "Gemini adapts remediation: 'High memory on pod checkout-api-7d4f matches runb..."
description: "Gemini adapts remediation: 'High memory on pod checkout-api-7d4f matches runbook RB-042 (memory leak restart) — but this pod was deployed 10 minutes ago. Likely code regression. Recommend rollback instead of restart.'"
source_id: "context-aware-remediation-selection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini adapts remediation: 'High memory on pod checkout-api-7d4f matches runbook RB-042 (memory leak restart) — but this pod was deployed 10 minutes ago. Likely code regression. Recommend rollback instead of restart.'

## Tools used

- [query_bigquery_runbook_history](/tools/query-bigquery-runbook-history.md)
- [action_kubernetes_rollback_deployment](/tools/action-kubernetes-rollback-deployment.md)
- [action_kubernetes_restart_pod](/tools/action-kubernetes-restart-pod.md)
- [evidence_runbook_library](/tools/evidence-runbook-library.md)

## Runs in

- [context_aware_remediation_selection](/workflow/context-aware-remediation-selection.md)

## Evidence expected

- sql_result
- api_response
- document_reference

## Evals

- [PagerDuty alert INC-0042: High memory on checkout-api pod, severity Sev-2. Last deployment was 3 days ago. Datadog shows gradual memory growth over 6 hours. Recommend and execute restart after SRE approval.](/tests/memory-leak-restart-happy-path.md)
- [PagerDuty alert INC-0043: Error rate spike on user-api, Sev-1. Deployment 10 minutes ago (v2.14.5 → v2.14.6). Datadog shows errors in new code path. Recommend rollback after SRE approval.](/tests/post-deploy-regression-rollback.md)
- [PagerDuty alert INC-0044: Database connection pool exhaustion, Sev-1. No matching runbook. Request SRE Manager assessment.](/tests/sev1-escalation-no-auto-action.md)

# Citations

- [SRE Runbook Library](/documents/sre-runbook-library.md)
- [Production Change Approval Policy](/documents/production-change-approval-policy.md)
