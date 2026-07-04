---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Geocode the full in-force book daily and join to Verisk ISO ERC territory_factors and loss_cost_benchmarks to attach territory relativity, cat load factor, and hazard/construction detail to every policy before it enters the rollup.](/queries/in-force-book-geocoding-hazard-enrichment.md)
- [Aggregate geocoded exposure into BigQuery analytics_events and historical_metrics by territory, county, and coastal band to produce daily TIV and PML rollups against cached_aggregates baselines.](/queries/zone-accumulation-rollup.md)
- [Cross-check flagged accumulations and PML variance against the Catastrophe Exposure Rollup Engine Authority & Referral Guide via lookup_cat_exposure_rollup_engine_authority_guide, and the Zone Appetite & Cat Accumulation Control Manual, before any recommendation or publish.](/queries/evidence-validation-authority-check.md)
- [Execute action_verisk_iso_erc_publish with a full audit trail, refresh Looker dashboards and metric_definitions with live PML/TIV, and generate reinsurer-ready exposure schedules on demand.](/queries/publish-reinsurer-schedule-distribution.md)
