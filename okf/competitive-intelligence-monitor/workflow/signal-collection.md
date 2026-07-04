---
type: Workflow Stage
title: Signal Collection
description: "Poll competitor websites via SEMrush, ingest news feeds from Google News API, monitor LinkedIn company pages for job postings and leadership changes. Aggregate all signals into BigQuery."
source_id: signal_collection
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Signal Collection

Poll competitor websites via SEMrush, ingest news feeds from Google News API, monitor LinkedIn company pages for job postings and leadership changes. Aggregate all signals into BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_competitive_intelligence_monitor_playbook](/tools/lookup-competitive-intelligence-monitor-playbook.md)
- [action_semrush_recommend](/tools/action-semrush-recommend.md)

Next: [Quantitative Analysis](/workflow/quantitative-analysis.md)
