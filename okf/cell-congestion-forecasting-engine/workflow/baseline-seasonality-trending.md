---
type: Workflow Stage
title: "Baseline & Seasonality Trending"
description: "Compare current counters against historical_metrics, analytics_events, and cached_aggregates in BigQuery (query_bigquery_analytics_events) to separate real trend and seasonality from event-driven traffic spikes per sector."
source_id: baseline_seasonality_trending
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Baseline & Seasonality Trending

Compare current counters against historical_metrics, analytics_events, and cached_aggregates in BigQuery (query_bigquery_analytics_events) to separate real trend and seasonality from event-driven traffic spikes per sector.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

Next: [Sector Demand Forecasting & Backlog Ranking](/workflow/sector-demand-forecasting-backlog-ranking.md)
