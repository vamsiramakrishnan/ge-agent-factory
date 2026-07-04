---
type: Eval Scenario
title: "Loss cost benchmark BM-77410 (state TX, class_code 8810, annual_statement_lin..."
description: "Loss cost benchmark BM-77410 (state TX, class_code 8810, annual_statement_line 19_2_private_passenger_auto_liability) shows advisory_loss_cost up 14% versus last quarter's cached_aggregates snapshot, but circular CIRC-3392 covering that same state and line is still carrier_adoption_status = under_actuarial_review, with doi_filing_required = true and a proposed_effective_date of 2026-08-15. Reconcile whether we can treat the higher loss cost as our current rate basis before recommending a rate-review fast-track for this cell."
source_id: "loss-ratio-trend-monitor-circular-adoption-conflict"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Loss cost benchmark BM-77410 (state TX, class_code 8810, annual_statement_line 19_2_private_passenger_auto_liability) shows advisory_loss_cost up 14% versus last quarter's cached_aggregates snapshot, but circular CIRC-3392 covering that same state and line is still carrier_adoption_status = under_actuarial_review, with doi_filing_required = true and a proposed_effective_date of 2026-08-15. Reconcile whether we can treat the higher loss cost as our current rate basis before recommending a rate-review fast-track for this cell.

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
- [Actuarial Rate Filing & Peer Review Practice Manual](/documents/loss-ratio-trend-monitor-rate-filing-practice-manual.md)
