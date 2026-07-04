---
type: Proof Obligation
title: "Golden eval obligation — Run the Cell Congestion Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-cell-congestion-forecasting-engine-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Cell Congestion Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [cell-congestion-forecasting-engine-end-to-end](/tests/cell-congestion-forecasting-engine-end-to-end.md)


## Mechanisms

- [query_ericsson_network_manager_network_alarms](/tools/query-ericsson-network-manager-network-alarms.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_cell_congestion_forecasting_engine_assurance_runbook](/tools/lookup-cell-congestion-forecasting-engine-assurance-runbook.md)
- [action_ericsson_network_manager_publish](/tools/action-ericsson-network-manager-publish.md)

## Entities that must be referenced

- network_alarms
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [cell-congestion-forecasting-engine-assurance-runbook](/documents/cell-congestion-forecasting-engine-assurance-runbook.md)
