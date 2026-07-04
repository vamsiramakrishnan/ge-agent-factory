---
type: Proof Obligation
title: "Golden eval obligation — Loss cost benchmark BM-77410 (state TX, class_code 8810, annual_statement_line 19_2_private_passenger_auto_liability) shows advisory_loss_cost up 14% versus last quarter's cached_aggregates snapshot, but circular CIRC-3392 covering that same state and line is still carrier_adoption_status = under_actuarial_review, with doi_filing_required = true and a proposed_effective_date of 2026-08-15. Reconcile whether we can treat the higher loss cost as our current rate basis before recommending a rate-review fast-track for this cell."
description: golden eval proof obligation
source_id: "eval-loss-ratio-trend-monitor-circular-adoption-conflict"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Loss cost benchmark BM-77410 (state TX, class_code 8810, annual_statement_line 19_2_private_passenger_auto_liability) shows advisory_loss_cost up 14% versus last quarter's cached_aggregates snapshot, but circular CIRC-3392 covering that same state and line is still carrier_adoption_status = under_actuarial_review, with doi_filing_required = true and a proposed_effective_date of 2026-08-15. Reconcile whether we can treat the higher loss cost as our current rate basis before recommending a rate-review fast-track for this cell.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [loss-ratio-trend-monitor-circular-adoption-conflict](/tests/loss-ratio-trend-monitor-circular-adoption-conflict.md)


## Mechanisms

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loss_ratio_trend_monitor_authority_guide](/tools/lookup-loss-ratio-trend-monitor-authority-guide.md)

## Entities that must be referenced

- loss_cost_benchmarks
- circular_updates

## Forbidden behaviors

- Treating the under_actuarial_review circular as the adopted current rate level
- Recommending a rate-review fast-track without resolving the adoption-status conflict

# Citations

- [loss-ratio-trend-monitor-authority-guide](/documents/loss-ratio-trend-monitor-authority-guide.md)
- [loss-ratio-trend-monitor-rate-filing-practice-manual](/documents/loss-ratio-trend-monitor-rate-filing-practice-manual.md)
