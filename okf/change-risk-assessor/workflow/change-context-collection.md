---
type: Workflow Stage
title: Change Context Collection
description: "Pull change request details from ServiceNow, related code changes from GitHub, and deployment context from Jira. Map affected services using Datadog dependency graph."
source_id: change_context_collection
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Change Context Collection

Pull change request details from ServiceNow, related code changes from GitHub, and deployment context from Jira. Map affected services using Datadog dependency graph.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_change_risk_assessor_runbook](/tools/lookup-change-risk-assessor-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

Next: [Conflict & Dependency Analysis](/workflow/conflict-dependency-analysis.md)
