---
type: Proof Obligation
title: "Golden eval obligation — Run the Store Replenishment Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-store-replenishment-orchestrator-end-to-end"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Store Replenishment Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [store-replenishment-orchestrator-end-to-end](/tests/store-replenishment-orchestrator-end-to-end.md)


## Mechanisms

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_store_replenishment_orchestrator_execution_playbook](/tools/lookup-store-replenishment-orchestrator-execution-playbook.md)
- [action_oracle_retail_mfcs_approve](/tools/action-oracle-retail-mfcs-approve.md)

## Entities that must be referenced

- demand_forecasts
- item_master
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute approve without two-system evidence

# Citations

- [store-replenishment-orchestrator-execution-playbook](/documents/store-replenishment-orchestrator-execution-playbook.md)
