---
type: Eval Scenario
title: "Loss cost benchmark BM-91027 (state FL, class_code 4053, annual_statement_lin..."
description: "Loss cost benchmark BM-91027 (state FL, class_code 4053, annual_statement_line 04_homeowners_multi_peril) carries credibility_factor 0.14, and analytics_events records AE-40218 (period 2026-05) and AE-40391 (period 2026-06) both show variance_pct at +16% against historical_metrics. The Chief Actuary wants to know whether this cell should be fast-tracked for rate review this week."
source_id: "loss-ratio-trend-monitor-low-credibility-edge"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Loss cost benchmark BM-91027 (state FL, class_code 4053, annual_statement_line 04_homeowners_multi_peril) carries credibility_factor 0.14, and analytics_events records AE-40218 (period 2026-05) and AE-40391 (period 2026-06) both show variance_pct at +16% against historical_metrics. The Chief Actuary wants to know whether this cell should be fast-tracked for rate review this week.

## Validates

- [segment-loss-ratio-decomposition](/queries/segment-loss-ratio-decomposition.md)

## Mechanisms to call

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loss_ratio_trend_monitor_authority_guide](/tools/lookup-loss-ratio-trend-monitor-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Loss Ratio Trend Monitor Authority & Referral Guide](/documents/loss-ratio-trend-monitor-authority-guide.md)
