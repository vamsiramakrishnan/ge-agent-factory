---
type: Workflow Stage
title: "Execution & Verification"
description: "After SRE approval, execute selected remediation via Kubernetes API (rollback, restart, scale). Verify recovery through Datadog health checks. Update PagerDuty incident with resolution."
source_id: execution_verification
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Execution & Verification

After SRE approval, execute selected remediation via Kubernetes API (rollback, restart, scale). Verify recovery through Datadog health checks. Update PagerDuty incident with resolution.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_pagerduty_active_incidents](/tools/query-pagerduty-active-incidents.md)
- [query_datadog_apm_traces](/tools/query-datadog-apm-traces.md)
- [query_datadog_metrics](/tools/query-datadog-metrics.md)
- [query_kubernetes_pod_status](/tools/query-kubernetes-pod-status.md)
- [action_kubernetes_rollback_deployment](/tools/action-kubernetes-rollback-deployment.md)
- [action_kubernetes_restart_pod](/tools/action-kubernetes-restart-pod.md)
- [action_pagerduty_update_incident](/tools/action-pagerduty-update-incident.md)
