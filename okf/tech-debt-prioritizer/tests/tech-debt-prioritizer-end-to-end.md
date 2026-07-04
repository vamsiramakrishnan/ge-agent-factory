---
type: Eval Scenario
title: Run the Tech Debt Prioritizer workflow for the current period. Cite the relev...
description: "Run the Tech Debt Prioritizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "tech-debt-prioritizer-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Tech Debt Prioritizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [metric-aggregation](/queries/metric-aggregation.md)

## Mechanisms to call

- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_tech_debt_prioritizer_runbook](/tools/lookup-tech-debt-prioritizer-runbook.md)

## Success rubric

VP Engineering / DevOps Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Tech Debt Prioritizer Operations Runbook](/documents/tech-debt-prioritizer-runbook.md)
