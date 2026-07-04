---
type: Workflow Stage
title: "Incident & Deployment Correlation"
description: Receive incident alert from PagerDuty. Correlate incident timeline with recent deployments from GitHub and infrastructure events from Datadog deployment markers.
source_id: incident_deployment_correlation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Incident & Deployment Correlation

Receive incident alert from PagerDuty. Correlate incident timeline with recent deployments from GitHub and infrastructure events from Datadog deployment markers.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [lookup_incident_to_code_tracer_runbook](/tools/lookup-incident-to-code-tracer-runbook.md)
- [action_github_recommend](/tools/action-github-recommend.md)

Next: [Root Cause Reasoning](/workflow/root-cause-reasoning.md)
