---
type: Proof Obligation
title: "Golden eval obligation — Run the Succession Pipeline Dashboard Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-succession-pipeline-dashboard-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Succession Pipeline Dashboard Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [succession-pipeline-dashboard-agent-end-to-end](/tests/succession-pipeline-dashboard-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_tableau_dashboards](/tools/query-tableau-dashboards.md)
- [lookup_succession_pipeline_dashboard_agent_policy_handbook](/tools/lookup-succession-pipeline-dashboard-agent-policy-handbook.md)

## Entities that must be referenced

- employees
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [succession-pipeline-dashboard-agent-policy-handbook](/documents/succession-pipeline-dashboard-agent-policy-handbook.md)
