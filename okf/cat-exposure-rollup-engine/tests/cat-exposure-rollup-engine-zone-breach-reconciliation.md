---
type: Eval Scenario
title: "Policy bind confirmation TX-HAR-88213 was geocoded into Harris County coastal..."
description: "Policy bind confirmation TX-HAR-88213 was geocoded into Harris County coastal band GC-14 this morning with a $42M TIV addition. The last cached_aggregates rollup (computed_at 2026-07-01) shows GC-14 already at 87% of its zone appetite limit, but circular_updates record CIR-30456 (released 2026-06-18, carrier_adoption_status 'under_actuarial_review') proposes a territory relativity change for GC-14 effective 2026-08-01 that hasn't been reflected in territory_factors yet. Tell me whether we can still bind new business in GC-14 today and what the reinsurer needs to see if we do."
source_id: "cat-exposure-rollup-engine-zone-breach-reconciliation"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Policy bind confirmation TX-HAR-88213 was geocoded into Harris County coastal band GC-14 this morning with a $42M TIV addition. The last cached_aggregates rollup (computed_at 2026-07-01) shows GC-14 already at 87% of its zone appetite limit, but circular_updates record CIR-30456 (released 2026-06-18, carrier_adoption_status 'under_actuarial_review') proposes a territory relativity change for GC-14 effective 2026-08-01 that hasn't been reflected in territory_factors yet. Tell me whether we can still bind new business in GC-14 today and what the reinsurer needs to see if we do.

## Validates

- [zone-accumulation-rollup](/queries/zone-accumulation-rollup.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [lookup_cat_exposure_rollup_engine_authority_guide](/tools/lookup-cat-exposure-rollup-engine-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Catastrophe Exposure Rollup Engine Authority & Referral Guide](/documents/cat-exposure-rollup-engine-authority-guide.md)
- [Zone Appetite & Cat Accumulation Control Manual](/documents/cat-exposure-rollup-engine-zone-appetite-manual.md)
