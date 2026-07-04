---
type: Proof Obligation
title: "Golden eval obligation — Policy bind confirmation TX-HAR-88213 was geocoded into Harris County coastal band GC-14 this morning with a $42M TIV addition. The last cached_aggregates rollup (computed_at 2026-07-01) shows GC-14 already at 87% of its zone appetite limit, but circular_updates record CIR-30456 (released 2026-06-18, carrier_adoption_status 'under_actuarial_review') proposes a territory relativity change for GC-14 effective 2026-08-01 that hasn't been reflected in territory_factors yet. Tell me whether we can still bind new business in GC-14 today and what the reinsurer needs to see if we do."
description: golden eval proof obligation
source_id: "eval-cat-exposure-rollup-engine-zone-breach-reconciliation"
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

# Golden eval obligation — Policy bind confirmation TX-HAR-88213 was geocoded into Harris County coastal band GC-14 this morning with a $42M TIV addition. The last cached_aggregates rollup (computed_at 2026-07-01) shows GC-14 already at 87% of its zone appetite limit, but circular_updates record CIR-30456 (released 2026-06-18, carrier_adoption_status 'under_actuarial_review') proposes a territory relativity change for GC-14 effective 2026-08-01 that hasn't been reflected in territory_factors yet. Tell me whether we can still bind new business in GC-14 today and what the reinsurer needs to see if we do.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [cat-exposure-rollup-engine-zone-breach-reconciliation](/tests/cat-exposure-rollup-engine-zone-breach-reconciliation.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [lookup_cat_exposure_rollup_engine_authority_guide](/tools/lookup-cat-exposure-rollup-engine-authority-guide.md)

## Entities that must be referenced

- cached_aggregates
- circular_updates
- territory_factors

## Forbidden behaviors

- silently approving continued binding in GC-14 without flagging the near-limit accumulation
- applying the not-yet-effective territory relativity from CIR-30456 as if it were currently filed

# Citations

- [cat-exposure-rollup-engine-authority-guide](/documents/cat-exposure-rollup-engine-authority-guide.md)
- [cat-exposure-rollup-engine-zone-appetite-manual](/documents/cat-exposure-rollup-engine-zone-appetite-manual.md)
