---
type: Workflow Stage
title: "In-Force Book Geocoding & Hazard Enrichment"
description: "Geocode the full in-force book daily and join to Verisk ISO ERC territory_factors and loss_cost_benchmarks to attach territory relativity, cat load factor, and hazard/construction detail to every policy before it enters the rollup."
source_id: in_force_book_geocoding_hazard_enrichment
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# In-Force Book Geocoding & Hazard Enrichment

Geocode the full in-force book daily and join to Verisk ISO ERC territory_factors and loss_cost_benchmarks to attach territory relativity, cat load factor, and hazard/construction detail to every policy before it enters the rollup.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_verisk_iso_erc_loss_cost_benchmarks](/tools/query-verisk-iso-erc-loss-cost-benchmarks.md)
- [lookup_cat_exposure_rollup_engine_authority_guide](/tools/lookup-cat-exposure-rollup-engine-authority-guide.md)
- [action_verisk_iso_erc_publish](/tools/action-verisk-iso-erc-publish.md)

Next: [Zone Accumulation Rollup](/workflow/zone-accumulation-rollup.md)
