---
type: Proof Obligation
title: "Golden eval obligation — Item 55190244 (department general_merchandise, item_status clearance) is sitting at weeks_of_supply 21.4 with only a first_markdown_25 applied per the June 20 price_recommendations pull, and BigQuery analytics_events hasn't refreshed for this zone since June 25 (over 24 hours stale). Decide whether to push a deeper markdown now."
description: golden eval proof obligation
source_id: "eval-markdown-optimization-engine-aging-clearance-edge"
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

# Golden eval obligation — Item 55190244 (department general_merchandise, item_status clearance) is sitting at weeks_of_supply 21.4 with only a first_markdown_25 applied per the June 20 price_recommendations pull, and BigQuery analytics_events hasn't refreshed for this zone since June 25 (over 24 hours stale). Decide whether to push a deeper markdown now.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [markdown-optimization-engine-aging-clearance-edge](/tests/markdown-optimization-engine-aging-clearance-edge.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_markdown_optimization_engine_execution_playbook](/tools/lookup-markdown-optimization-engine-execution-playbook.md)

## Entities that must be referenced

- price_recommendations
- analytics_events
- item_master

## Forbidden behaviors

- auto-applying second_markdown_40 or deeper on stale analytics_events evidence
- treating the clearance item_status alone as sufficient justification without checking weeks_of_supply and evidence freshness

# Citations

- [markdown-optimization-engine-execution-playbook](/documents/markdown-optimization-engine-execution-playbook.md)
