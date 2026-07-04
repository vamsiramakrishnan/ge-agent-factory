---
type: Query Capability
title: "Pull platform-specific metrics from Sprout Social and Hootsuite. Correlate so..."
description: "Pull platform-specific metrics from Sprout Social and Hootsuite. Correlate social engagement with website traffic and conversions from GA4. Aggregate in BigQuery."
source_id: "metrics-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull platform-specific metrics from Sprout Social and Hootsuite. Correlate social engagement with website traffic and conversions from GA4. Aggregate in BigQuery.

## Tools used

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hootsuite_social_posts](/tools/query-hootsuite-social-posts.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_social_media_analytics_dashboard_playbook](/tools/lookup-social-media-analytics-dashboard-playbook.md)
- [action_sprout_social_recommend](/tools/action-sprout-social-recommend.md)

## Runs in

- [metrics_aggregation](/workflow/metrics-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Social Media Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/social-media-analytics-dashboard-end-to-end.md)

# Citations

- [Social Media Analytics Dashboard Playbook](/documents/social-media-analytics-dashboard-playbook.md)
