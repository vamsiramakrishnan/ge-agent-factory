---
type: Proof Obligation
title: "Golden eval obligation — Loyalty segment 'mid_market winback' has run three publish cycles. The latest analytics_events row for metric_name 'offer_redemption_rate' has computed_at of 2026-06-20 -- 14 days ago -- while historical_metrics for the same holdout cohort was last computed 2026-07-03. Determine whether to retire the offer against its holdout and publish the next cycle."
description: golden eval proof obligation
source_id: "eval-next-best-offer-engine-holdout-stale-eval"
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

# Golden eval obligation — Loyalty segment 'mid_market winback' has run three publish cycles. The latest analytics_events row for metric_name 'offer_redemption_rate' has computed_at of 2026-06-20 -- 14 days ago -- while historical_metrics for the same holdout cohort was last computed 2026-07-03. Determine whether to retire the offer against its holdout and publish the next cycle.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [next-best-offer-engine-holdout-stale-eval](/tests/next-best-offer-engine-holdout-stale-eval.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_next_best_offer_engine_execution_playbook](/tools/lookup-next-best-offer-engine-execution-playbook.md)

## Entities that must be referenced

- analytics_events
- historical_metrics

## Forbidden behaviors

- publishing or retiring the offer using the stale 2026-06-20 redemption figure
- invoking action_oracle_xstore_pos_publish before evidence currency is confirmed

# Citations

- [next-best-offer-engine-execution-playbook](/documents/next-best-offer-engine-execution-playbook.md)
- [next-best-offer-margin-liability-rate-card](/documents/next-best-offer-margin-liability-rate-card.md)
