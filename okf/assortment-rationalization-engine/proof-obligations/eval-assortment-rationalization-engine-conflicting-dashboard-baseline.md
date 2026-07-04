---
type: Proof Obligation
title: "Golden eval obligation — Class 4412 (salty_snacks, merchandise_hierarchy record with gmroi_target 2.4) needs its keep/delist deck published for tomorrow. The Looker 'dashboards' record for this period reports SKU productivity at $11,950/yr, but the BigQuery cached_aggregates record for the same period and metric_name reports $9,860/yr. Which number goes in the deck, and can we route the delist proposal now?"
description: golden eval proof obligation
source_id: "eval-assortment-rationalization-engine-conflicting-dashboard-baseline"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Class 4412 (salty_snacks, merchandise_hierarchy record with gmroi_target 2.4) needs its keep/delist deck published for tomorrow. The Looker 'dashboards' record for this period reports SKU productivity at $11,950/yr, but the BigQuery cached_aggregates record for the same period and metric_name reports $9,860/yr. Which number goes in the deck, and can we route the delist proposal now?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [assortment-rationalization-engine-conflicting-dashboard-baseline](/tests/assortment-rationalization-engine-conflicting-dashboard-baseline.md)


## Mechanisms

- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_assortment_rationalization_engine_execution_playbook](/tools/lookup-assortment-rationalization-engine-execution-playbook.md)

## Entities that must be referenced

- dashboards
- cached_aggregates
- historical_metrics

## Forbidden behaviors

- publishing either figure into the deck as authoritative without flagging the conflict
- calling action_oracle_retail_mfcs_route before the productivity figures are reconciled

# Citations

- [assortment-rationalization-engine-execution-playbook](/documents/assortment-rationalization-engine-execution-playbook.md)
