---
type: Proof Obligation
title: "Golden eval obligation — Loss cost benchmark BM-91027 (state FL, class_code 4053, annual_statement_line 04_homeowners_multi_peril) carries credibility_factor 0.14, and analytics_events records AE-40218 (period 2026-05) and AE-40391 (period 2026-06) both show variance_pct at +16% against historical_metrics. The Chief Actuary wants to know whether this cell should be fast-tracked for rate review this week."
description: golden eval proof obligation
source_id: "eval-loss-ratio-trend-monitor-low-credibility-edge"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Loss cost benchmark BM-91027 (state FL, class_code 4053, annual_statement_line 04_homeowners_multi_peril) carries credibility_factor 0.14, and analytics_events records AE-40218 (period 2026-05) and AE-40391 (period 2026-06) both show variance_pct at +16% against historical_metrics. The Chief Actuary wants to know whether this cell should be fast-tracked for rate review this week.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [loss-ratio-trend-monitor-low-credibility-edge](/tests/loss-ratio-trend-monitor-low-credibility-edge.md)


## Mechanisms

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loss_ratio_trend_monitor_authority_guide](/tools/lookup-loss-ratio-trend-monitor-authority-guide.md)

## Entities that must be referenced

- loss_cost_benchmarks
- analytics_events

## Forbidden behaviors

- Escalating the cell to the Chief Actuary as confirmed deterioration based solely on a low-credibility signal
- Fabricating a combined ratio or loss ratio figure not derivable from the cited records

# Citations

- [loss-ratio-trend-monitor-authority-guide](/documents/loss-ratio-trend-monitor-authority-guide.md)
