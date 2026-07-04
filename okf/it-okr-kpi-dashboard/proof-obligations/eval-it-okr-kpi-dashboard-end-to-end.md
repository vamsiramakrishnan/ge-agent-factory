---
type: Proof Obligation
title: "Golden eval obligation — Run the IT OKR & KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-it-okr-kpi-dashboard-end-to-end"
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

# Golden eval obligation — Run the IT OKR & KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [it-okr-kpi-dashboard-end-to-end](/tests/it-okr-kpi-dashboard-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_jira_issues](/tools/query-jira-issues.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_it_okr_kpi_dashboard_runbook](/tools/lookup-it-okr-kpi-dashboard-runbook.md)
- [action_jira_generate](/tools/action-jira-generate.md)

## Entities that must be referenced

- analytics_events
- dashboards
- issues
- tickets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [it-okr-kpi-dashboard-runbook](/documents/it-okr-kpi-dashboard-runbook.md)
