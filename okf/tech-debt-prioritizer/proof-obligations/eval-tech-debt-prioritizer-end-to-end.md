---
type: Proof Obligation
title: "Golden eval obligation — Run the Tech Debt Prioritizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-tech-debt-prioritizer-end-to-end"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Tech Debt Prioritizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [tech-debt-prioritizer-end-to-end](/tests/tech-debt-prioritizer-end-to-end.md)


## Mechanisms

- [query_sonarqube_code_smells](/tools/query-sonarqube-code-smells.md)
- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_tech_debt_prioritizer_runbook](/tools/lookup-tech-debt-prioritizer-runbook.md)

## Entities that must be referenced

- code_smells
- pull_requests
- issues
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [tech-debt-prioritizer-runbook](/documents/tech-debt-prioritizer-runbook.md)
