---
type: Workflow Stage
title: Metric Aggregation
description: "Aggregate code quality metrics from SonarQube, dependency age and change frequency from GitHub, vulnerability counts from Snyk, and incident correlation from Jira."
source_id: metric_aggregation
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Metric Aggregation

Aggregate code quality metrics from SonarQube, dependency age and change frequency from GitHub, vulnerability counts from Snyk, and incident correlation from Jira.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_jira_issues](/tools/query-jira-issues.md)

Next: [Debt Scoring & ROI Estimation](/workflow/debt-scoring-roi-estimation.md)
