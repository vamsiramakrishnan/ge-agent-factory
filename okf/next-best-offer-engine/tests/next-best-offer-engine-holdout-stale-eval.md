---
type: Eval Scenario
title: "Loyalty segment 'mid_market winback' has run three publish cycles. The latest..."
description: "Loyalty segment 'mid_market winback' has run three publish cycles. The latest analytics_events row for metric_name 'offer_redemption_rate' has computed_at of 2026-06-20 -- 14 days ago -- while historical_metrics for the same holdout cohort was last computed 2026-07-03. Determine whether to retire the offer against its holdout and publish the next cycle."
source_id: "next-best-offer-engine-holdout-stale-eval"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Loyalty segment 'mid_market winback' has run three publish cycles. The latest analytics_events row for metric_name 'offer_redemption_rate' has computed_at of 2026-06-20 -- 14 days ago -- while historical_metrics for the same holdout cohort was last computed 2026-07-03. Determine whether to retire the offer against its holdout and publish the next cycle.

## Validates

- [member-signal-unification](/queries/member-signal-unification.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_next_best_offer_engine_execution_playbook](/tools/lookup-next-best-offer-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Next Best Offer Engine Retail Execution Playbook](/documents/next-best-offer-engine-execution-playbook.md)
- [Loyalty Offer Margin & Liability Rate Card](/documents/next-best-offer-margin-liability-rate-card.md)
