---
type: Proof Obligation
title: "Golden eval obligation — Run the Portfolio Prioritization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-portfolio-prioritization-engine-end-to-end"
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

# Golden eval obligation — Run the Portfolio Prioritization Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [portfolio-prioritization-engine-end-to-end](/tests/portfolio-prioritization-engine-end-to-end.md)


## Mechanisms

- [query_servicenow_spm_tickets](/tools/query-servicenow-spm-tickets.md)
- [query_jira_portfolio_issues](/tools/query-jira-portfolio-issues.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_portfolio_prioritization_engine_runbook](/tools/lookup-portfolio-prioritization-engine-runbook.md)

## Entities that must be referenced

- tickets
- issues
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [portfolio-prioritization-engine-runbook](/documents/portfolio-prioritization-engine-runbook.md)
