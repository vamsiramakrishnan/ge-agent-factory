---
type: Workflow Stage
title: Metrics Aggregation
description: "Pull platform-specific metrics from Sprout Social and Hootsuite. Correlate social engagement with website traffic and conversions from GA4. Aggregate in BigQuery."
source_id: metrics_aggregation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Metrics Aggregation

Pull platform-specific metrics from Sprout Social and Hootsuite. Correlate social engagement with website traffic and conversions from GA4. Aggregate in BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hootsuite_social_posts](/tools/query-hootsuite-social-posts.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_social_media_analytics_dashboard_playbook](/tools/lookup-social-media-analytics-dashboard-playbook.md)
- [action_sprout_social_recommend](/tools/action-sprout-social-recommend.md)

Next: [Performance Narrative](/workflow/performance-narrative.md)
