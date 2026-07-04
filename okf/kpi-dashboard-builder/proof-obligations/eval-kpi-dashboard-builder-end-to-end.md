---
type: Proof Obligation
title: "Golden eval obligation — Run the KPI Dashboard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-kpi-dashboard-builder-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the KPI Dashboard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [kpi-dashboard-builder-end-to-end](/tests/kpi-dashboard-builder-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_kpi_dashboard_builder_controls_playbook](/tools/lookup-kpi-dashboard-builder-controls-playbook.md)
- [action_finance_3_route](/tools/action-finance-3-route.md)

## Entities that must be referenced

- analytics_events
- dashboards
- finance_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute route without two-system evidence

# Citations

- [kpi-dashboard-builder-controls-playbook](/documents/kpi-dashboard-builder-controls-playbook.md)
