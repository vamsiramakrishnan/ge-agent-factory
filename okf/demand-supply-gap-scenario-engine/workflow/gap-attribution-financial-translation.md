---
type: Workflow Stage
title: "Gap Attribution & Financial Translation"
description: "Joins scenario_runs outputs against demand_signals and supply_plans, then cross-references BigQuery analytics_events and historical_metrics via query_bigquery_analytics_events to translate the aggregate demand-supply gap into affected customer_name, abc_class tier, revenue, and margin exposure instead of raw units."
source_id: gap_attribution_financial_translation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Gap Attribution & Financial Translation

Joins scenario_runs outputs against demand_signals and supply_plans, then cross-references BigQuery analytics_events and historical_metrics via query_bigquery_analytics_events to translate the aggregate demand-supply gap into affected customer_name, abc_class tier, revenue, and margin exposure instead of raw units.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_demand_supply_gap_scenario_engine_sop](/tools/lookup-demand-supply-gap-scenario-engine-sop.md)

Next: [SOP & Rate-Schedule Evidence Gating](/workflow/sop-rate-schedule-evidence-gating.md)
