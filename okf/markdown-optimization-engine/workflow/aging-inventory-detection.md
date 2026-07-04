---
type: Workflow Stage
title: Aging Inventory Detection
description: "Screen weeks_of_supply and markdown_cadence in price_recommendations against analytics_events and historical_metrics in BigQuery to surface item_master SKUs drifting toward their clearance-exit window before the warehouse flags space."
source_id: aging_inventory_detection
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Aging Inventory Detection

Screen weeks_of_supply and markdown_cadence in price_recommendations against analytics_events and historical_metrics in BigQuery to surface item_master SKUs drifting toward their clearance-exit window before the warehouse flags space.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_markdown_optimization_engine_execution_playbook](/tools/lookup-markdown-optimization-engine-execution-playbook.md)

Next: [Markdown Ladder Simulation](/workflow/markdown-ladder-simulation.md)
