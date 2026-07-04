---
type: Query Capability
title: "Aggregate code quality metrics from SonarQube, dependency age and change freq..."
description: "Aggregate code quality metrics from SonarQube, dependency age and change frequency from GitHub, vulnerability counts from Snyk, and incident correlation from Jira."
source_id: "metric-aggregation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate code quality metrics from SonarQube, dependency age and change frequency from GitHub, vulnerability counts from Snyk, and incident correlation from Jira.

## Tools used

- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_jira_issues](/tools/query-jira-issues.md)

## Runs in

- [metric_aggregation](/workflow/metric-aggregation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Tech Debt Prioritizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tech-debt-prioritizer-end-to-end.md)

# Citations

- [Tech Debt Prioritizer Operations Runbook](/documents/tech-debt-prioritizer-runbook.md)
