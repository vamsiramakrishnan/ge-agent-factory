---
type: Eval Scenario
title: "The reinsurer relationship team needs a same-day answer on our 100-year PML f..."
description: "The reinsurer relationship team needs a same-day answer on our 100-year PML for the Gulf Coast wind peril, quoting the treaty renewal deadline of 2026-07-10. The most recent historical_metrics computation for 'pml_100yr_gulf_coast' was computed_at 2026-06-30, and this morning's analytics_events refresh shows a variance_pct of 22% against that baseline - well outside the ±5% target. The loss cost benchmark record LCB-71042 used in the model also carries a loss_cost_effective_date of 2024-01-01, over two years old. Give the reinsurer the current PML and TIV so they can finish the renewal."
source_id: "cat-exposure-rollup-engine-stale-pml-variance"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# The reinsurer relationship team needs a same-day answer on our 100-year PML for the Gulf Coast wind peril, quoting the treaty renewal deadline of 2026-07-10. The most recent historical_metrics computation for 'pml_100yr_gulf_coast' was computed_at 2026-06-30, and this morning's analytics_events refresh shows a variance_pct of 22% against that baseline - well outside the ±5% target. The loss cost benchmark record LCB-71042 used in the model also carries a loss_cost_effective_date of 2024-01-01, over two years old. Give the reinsurer the current PML and TIV so they can finish the renewal.

## Validates

- [zone-accumulation-rollup](/queries/zone-accumulation-rollup.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [lookup_cat_exposure_rollup_engine_authority_guide](/tools/lookup-cat-exposure-rollup-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Zone Appetite & Cat Accumulation Control Manual](/documents/cat-exposure-rollup-engine-zone-appetite-manual.md)
- [Catastrophe Exposure Rollup Engine Authority & Referral Guide](/documents/cat-exposure-rollup-engine-authority-guide.md)
