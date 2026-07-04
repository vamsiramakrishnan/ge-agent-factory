---
type: Workflow Stage
title: "Theme & Sentiment Clustering"
description: "Mine ticket text, macros, and GA4 session_events (query_ga4_session_events) for repeating themes and sentiment shifts, then tag each cluster to the specific SKUs in product_catalog_entries and the vendors behind them."
source_id: theme_sentiment_clustering
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Theme & Sentiment Clustering

Mine ticket text, macros, and GA4 session_events (query_ga4_session_events) for repeating themes and sentiment shifts, then tag each cluster to the specific SKUs in product_catalog_entries and the vendors behind them.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_voice_of_customer_insights_analyzer_execution_playbook](/tools/lookup-voice-of-customer-insights-analyzer-execution-playbook.md)

Next: [Revenue & Return-Rate Impact Scoring](/workflow/revenue-return-rate-impact-scoring.md)
