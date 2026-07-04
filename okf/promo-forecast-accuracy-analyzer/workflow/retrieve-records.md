---
type: Workflow Stage
title: Retrieve Records
description: Query demand forecasts and forecast overrides from Blue Yonder Demand Planning and correlate with Revionics Price Optimization for the Promo Forecast Accuracy Analyzer workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query demand forecasts and forecast overrides from Blue Yonder Demand Planning and correlate with Revionics Price Optimization for the Promo Forecast Accuracy Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_promo_forecast_accuracy_analyzer_execution_playbook](/tools/lookup-promo-forecast-accuracy-analyzer-execution-playbook.md)
- [action_blue_yonder_demand_planning_publish](/tools/action-blue-yonder-demand-planning-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
