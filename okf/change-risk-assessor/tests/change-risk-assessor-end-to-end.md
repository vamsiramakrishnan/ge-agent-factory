---
type: Eval Scenario
title: Run the Change Risk Assessor workflow for the current period. Cite the releva...
description: "Run the Change Risk Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "change-risk-assessor-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Change Risk Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [change-context-collection](/queries/change-context-collection.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_change_risk_assessor_runbook](/tools/lookup-change-risk-assessor-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Success rubric

Action recommend executed against ServiceNow, with audit-trail entry and IT Service Desk Manager notified of outcomes.

# Citations

- [Change Risk Assessor Operations Runbook](/documents/change-risk-assessor-runbook.md)
