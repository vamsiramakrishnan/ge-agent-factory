---
type: Proof Obligation
title: "Golden eval obligation — Production order 1483221 at plant 1020 shows a scrap_qty of 92 against a planned_qty of 640 for the July 2 day shift, but the BigQuery historical_metrics baseline for that line still shows quality-loss variance_pct at only -4% versus last month. Before you publish the loss Pareto to Looker, tell me which number governs and what the OEE Loss Classification and Calculation Standard says about dollarizing it."
description: golden eval proof obligation
source_id: "eval-oee-loss-pareto-analyzer-conflicting-baseline"
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

# Golden eval obligation — Production order 1483221 at plant 1020 shows a scrap_qty of 92 against a planned_qty of 640 for the July 2 day shift, but the BigQuery historical_metrics baseline for that line still shows quality-loss variance_pct at only -4% versus last month. Before you publish the loss Pareto to Looker, tell me which number governs and what the OEE Loss Classification and Calculation Standard says about dollarizing it.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [oee-loss-pareto-analyzer-conflicting-baseline](/tests/oee-loss-pareto-analyzer-conflicting-baseline.md)


## Mechanisms

- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_oee_loss_pareto_analyzer_sop](/tools/lookup-oee-loss-pareto-analyzer-sop.md)

## Entities that must be referenced

- production_orders
- historical_metrics
- analytics_events

## Forbidden behaviors

- Publishing the loss Pareto to Looker before the discrepancy between production_orders and historical_metrics is resolved
- Silently averaging the two conflicting scrap and variance figures instead of flagging the conflict

# Citations

- [oee-loss-pareto-analyzer-sop](/documents/oee-loss-pareto-analyzer-sop.md)
- [oee-loss-classification-standard](/documents/oee-loss-classification-standard.md)
