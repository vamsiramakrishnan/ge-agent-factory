---
type: Workflow Stage
title: Zone Accumulation Rollup
description: "Aggregate geocoded exposure into BigQuery analytics_events and historical_metrics by territory, county, and coastal band to produce daily TIV and PML rollups against cached_aggregates baselines."
source_id: zone_accumulation_rollup
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Zone Accumulation Rollup

Aggregate geocoded exposure into BigQuery analytics_events and historical_metrics by territory, county, and coastal band to produce daily TIV and PML rollups against cached_aggregates baselines.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cat_exposure_rollup_engine_authority_guide](/tools/lookup-cat-exposure-rollup-engine-authority-guide.md)

Next: [Evidence Validation & Authority Check](/workflow/evidence-validation-authority-check.md)
