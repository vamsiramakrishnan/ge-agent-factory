---
type: Workflow Stage
title: Incident Update
description: Root cause report attached to PagerDuty incident and Jira ticket. Recommended action (rollback or hotfix) communicated to the incident response team.
source_id: incident_update
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Incident Update

Root cause report attached to PagerDuty incident and Jira ticket. Recommended action (rollback or hotfix) communicated to the incident response team.

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [query_pagerduty_incidents](/tools/query-pagerduty-incidents.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [lookup_incident_to_code_tracer_runbook](/tools/lookup-incident-to-code-tracer-runbook.md)
- [action_github_recommend](/tools/action-github-recommend.md)
