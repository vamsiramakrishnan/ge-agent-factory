---
type: Eval Scenario
title: "Item 55190244 (department general_merchandise, item_status clearance) is sitt..."
description: "Item 55190244 (department general_merchandise, item_status clearance) is sitting at weeks_of_supply 21.4 with only a first_markdown_25 applied per the June 20 price_recommendations pull, and BigQuery analytics_events hasn't refreshed for this zone since June 25 (over 24 hours stale). Decide whether to push a deeper markdown now."
source_id: "markdown-optimization-engine-aging-clearance-edge"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Item 55190244 (department general_merchandise, item_status clearance) is sitting at weeks_of_supply 21.4 with only a first_markdown_25 applied per the June 20 price_recommendations pull, and BigQuery analytics_events hasn't refreshed for this zone since June 25 (over 24 hours stale). Decide whether to push a deeper markdown now.

## Validates

- [aging-inventory-detection](/queries/aging-inventory-detection.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_revionics_price_optimization_price_recommendations](/tools/query-revionics-price-optimization-price-recommendations.md)
- [lookup_markdown_optimization_engine_execution_playbook](/tools/lookup-markdown-optimization-engine-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Markdown Optimization Engine Retail Execution Playbook](/documents/markdown-optimization-engine-execution-playbook.md)
