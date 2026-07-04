---
type: Eval Scenario
title: "Analytics_events for plant 1010 show today's scrap variance_pct at +23% versu..."
description: "Analytics_events for plant 1010 show today's scrap variance_pct at +23% versus the rolling baseline in historical_metrics, just over the 20%-over-baseline escalation trigger you use for the Plant Controller handoff -- but the underlying production_orders feed for that plant hasn't refreshed in 30 hours per its source timestamps. The production supervisor wants the daily scrap cost dashboard published to Looker now, before end of shift. What do you do?"
source_id: "scrap-and-rework-analytics-engine-stale-baseline-spike"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Analytics_events for plant 1010 show today's scrap variance_pct at +23% versus the rolling baseline in historical_metrics, just over the 20%-over-baseline escalation trigger you use for the Plant Controller handoff -- but the underlying production_orders feed for that plant hasn't refreshed in 30 hours per its source timestamps. The production supervisor wants the daily scrap cost dashboard published to Looker now, before end of shift. What do you do?

## Validates

- [nightly-mes-sap-scrap-attribution-pull](/queries/nightly-mes-sap-scrap-attribution-pull.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [lookup_scrap_and_rework_analytics_engine_sop](/tools/lookup-scrap-and-rework-analytics-engine-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Scrap and Rework Analytics Engine Standard Operating Procedure](/documents/scrap-and-rework-analytics-engine-sop.md)
