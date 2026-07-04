---
type: Eval Scenario
title: "Run the Incident-to-Code Tracer workflow for the current period. Cite the rel..."
description: "Run the Incident-to-Code Tracer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "incident-to-code-tracer-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Incident-to-Code Tracer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [incident-deployment-correlation](/queries/incident-deployment-correlation.md)

## Mechanisms to call

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_incident_to_code_tracer_runbook](/tools/lookup-incident-to-code-tracer-runbook.md)
- [action_github_recommend](/tools/action-github-recommend.md)

## Success rubric

Action recommend executed against GitHub, with audit-trail entry and DevOps Lead notified of outcomes.

# Citations

- [Incident-to-Code Tracer Operations Runbook](/documents/incident-to-code-tracer-runbook.md)
