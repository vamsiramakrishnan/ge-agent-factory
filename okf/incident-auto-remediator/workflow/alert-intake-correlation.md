---
type: Workflow Stage
title: "Alert Intake & Correlation"
description: "Receive alert from PagerDuty. Correlate with related alerts (deduplication), recent deployments, and infrastructure events. Pull service context from Datadog APM."
source_id: alert_intake_correlation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Alert Intake & Correlation

Receive alert from PagerDuty. Correlate with related alerts (deduplication), recent deployments, and infrastructure events. Pull service context from Datadog APM.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_pagerduty_active_incidents](/tools/query-pagerduty-active-incidents.md)
- [query_datadog_apm_traces](/tools/query-datadog-apm-traces.md)
- [query_datadog_metrics](/tools/query-datadog-metrics.md)
- [action_kubernetes_rollback_deployment](/tools/action-kubernetes-rollback-deployment.md)
- [action_pagerduty_update_incident](/tools/action-pagerduty-update-incident.md)

Next: [Root Cause Ranking](/workflow/root-cause-ranking.md)
