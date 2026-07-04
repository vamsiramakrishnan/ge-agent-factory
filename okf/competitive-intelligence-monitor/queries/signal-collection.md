---
type: Query Capability
title: "Poll competitor websites via SEMrush, ingest news feeds from Google News API,..."
description: "Poll competitor websites via SEMrush, ingest news feeds from Google News API, monitor LinkedIn company pages for job postings and leadership changes. Aggregate all signals into BigQuery."
source_id: "signal-collection"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Poll competitor websites via SEMrush, ingest news feeds from Google News API, monitor LinkedIn company pages for job postings and leadership changes. Aggregate all signals into BigQuery.

## Tools used

- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_competitive_intelligence_monitor_playbook](/tools/lookup-competitive-intelligence-monitor-playbook.md)
- [action_semrush_recommend](/tools/action-semrush-recommend.md)

## Runs in

- [signal_collection](/workflow/signal-collection.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Competitive Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/competitive-intelligence-monitor-end-to-end.md)

# Citations

- [Competitive Intelligence Monitor Playbook](/documents/competitive-intelligence-monitor-playbook.md)
