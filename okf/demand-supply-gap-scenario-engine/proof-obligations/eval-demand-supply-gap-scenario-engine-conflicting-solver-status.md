---
type: Proof Obligation
title: "Golden eval obligation — Scenario run #104521 (supplier_disruption, single-source ceramic-substrate vendor) came back solver_status=infeasible, but run #104522 for the same disruption -- filed four hours later -- shows optimal with service_level_pct at 94.2% and a $6.2M higher projected_inventory_value_usd. Materials wants the optimal number in Thursday's executive S&OP deck. Reconcile which run is defensible before we publish."
description: golden eval proof obligation
source_id: "eval-demand-supply-gap-scenario-engine-conflicting-solver-status"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Scenario run #104521 (supplier_disruption, single-source ceramic-substrate vendor) came back solver_status=infeasible, but run #104522 for the same disruption -- filed four hours later -- shows optimal with service_level_pct at 94.2% and a $6.2M higher projected_inventory_value_usd. Materials wants the optimal number in Thursday's executive S&OP deck. Reconcile which run is defensible before we publish.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [demand-supply-gap-scenario-engine-conflicting-solver-status](/tests/demand-supply-gap-scenario-engine-conflicting-solver-status.md)


## Mechanisms

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_demand_supply_gap_scenario_engine_sop](/tools/lookup-demand-supply-gap-scenario-engine-sop.md)

## Entities that must be referenced

- scenario_runs
- supply_plans
- analytics_events

## Forbidden behaviors

- publishing the optimal run's numbers into the executive briefing without reconciling the infeasible result
- fabricating a reconciled projected_inventory_value_usd instead of citing source-system evidence

# Citations

- [demand-supply-gap-scenario-engine-sop](/documents/demand-supply-gap-scenario-engine-sop.md)
- [s-op-service-level-rate-schedule](/documents/s-op-service-level-rate-schedule.md)
