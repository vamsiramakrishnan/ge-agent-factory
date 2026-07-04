---
type: Workflow Stage
title: "Context-Aware Remediation Selection"
description: "Gemini adapts remediation: 'High memory on pod checkout-api-7d4f matches runbook RB-042 (memory leak restart) — but this pod was deployed 10 minutes ago. Likely code regression. Recommend rollback instead of restart.'"
source_id: context_aware_remediation_selection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Context-Aware Remediation Selection

Gemini adapts remediation: 'High memory on pod checkout-api-7d4f matches runbook RB-042 (memory leak restart) — but this pod was deployed 10 minutes ago. Likely code regression. Recommend rollback instead of restart.'

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_bigquery_runbook_history](/tools/query-bigquery-runbook-history.md)
- [action_kubernetes_rollback_deployment](/tools/action-kubernetes-rollback-deployment.md)
- [action_kubernetes_restart_pod](/tools/action-kubernetes-restart-pod.md)
- [evidence_runbook_library](/tools/evidence-runbook-library.md)

Next: [Execution & Verification](/workflow/execution-verification.md)
