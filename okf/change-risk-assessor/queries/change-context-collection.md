---
type: Query Capability
title: "Pull change request details from ServiceNow, related code changes from GitHub..."
description: "Pull change request details from ServiceNow, related code changes from GitHub, and deployment context from Jira. Map affected services using Datadog dependency graph."
source_id: "change-context-collection"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull change request details from ServiceNow, related code changes from GitHub, and deployment context from Jira. Map affected services using Datadog dependency graph.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_datadog_alerts](/tools/query-datadog-alerts.md)
- [lookup_change_risk_assessor_runbook](/tools/lookup-change-risk-assessor-runbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [change_context_collection](/workflow/change-context-collection.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Change Risk Assessor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/change-risk-assessor-end-to-end.md)

# Citations

- [Change Risk Assessor Operations Runbook](/documents/change-risk-assessor-runbook.md)
