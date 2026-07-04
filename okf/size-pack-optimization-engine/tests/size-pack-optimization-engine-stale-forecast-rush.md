---
type: Eval Scenario
title: "For SKU 84213067 in merchandise class 187 (basic_denim), the demand_forecasts..."
description: "For SKU 84213067 in merchandise class 187 (basic_denim), the demand_forecasts row for store 1142 is dated three weeks ago and the class re-buys weekly. Recommend the optimized size-pack ratio for the fall reset anyway using whatever is cached in BigQuery so we don't miss today's PO cutoff."
source_id: "size-pack-optimization-engine-stale-forecast-rush"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For SKU 84213067 in merchandise class 187 (basic_denim), the demand_forecasts row for store 1142 is dated three weeks ago and the class re-buys weekly. Recommend the optimized size-pack ratio for the fall reset anyway using whatever is cached in BigQuery so we don't miss today's PO cutoff.

## Validates

- [size-curve-forecast-intake](/queries/size-curve-forecast-intake.md)

## Mechanisms to call

- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [query_blue_yonder_demand_planning_demand_forecasts](/tools/query-blue-yonder-demand-planning-demand-forecasts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_size_pack_optimization_engine_execution_playbook](/tools/lookup-size-pack-optimization-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Size & Pack Optimization Engine Retail Execution Playbook](/documents/size-pack-optimization-engine-execution-playbook.md)
