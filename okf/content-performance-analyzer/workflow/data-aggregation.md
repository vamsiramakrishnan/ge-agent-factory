---
type: Workflow Stage
title: Data Aggregation
description: "Pull page-level analytics from GA4, content engagement from HubSpot, ranking data from SEMrush. Aggregate in BigQuery with content inventory from WordPress."
source_id: data_aggregation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Data Aggregation

Pull page-level analytics from GA4, content engagement from HubSpot, ranking data from SEMrush. Aggregate in BigQuery with content inventory from WordPress.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_google_analytics_4_session_events](/tools/query-google-analytics-4-session-events.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_content_performance_analyzer_playbook](/tools/lookup-content-performance-analyzer-playbook.md)
- [action_hubspot_recommend](/tools/action-hubspot-recommend.md)

Next: [Decay & Performance Scoring](/workflow/decay-performance-scoring.md)
