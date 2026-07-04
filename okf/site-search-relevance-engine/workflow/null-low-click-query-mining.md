---
type: Workflow Stage
title: "Null & Low-Click Query Mining"
description: "Query BigQuery analytics_events and historical_metrics alongside GA4 session_events to flag zero-result, low-click-through, and misrouted search terms across the full daily search-log tail."
source_id: "null_low_click_query_mining"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Null & Low-Click Query Mining

Query BigQuery analytics_events and historical_metrics alongside GA4 session_events to flag zero-result, low-click-through, and misrouted search terms across the full daily search-log tail.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_site_search_relevance_engine_execution_playbook](/tools/lookup-site-search-relevance-engine-execution-playbook.md)
- [action_salesforce_commerce_cloud_route](/tools/action-salesforce-commerce-cloud-route.md)

Next: [Assortment Gap Triage](/workflow/assortment-gap-triage.md)
