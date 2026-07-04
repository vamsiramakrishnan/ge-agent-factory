---
type: Eval Scenario
title: Run the Social Media Analytics Dashboard workflow for the current period. Cit...
description: "Run the Social Media Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "social-media-analytics-dashboard-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Social Media Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [metrics-aggregation](/queries/metrics-aggregation.md)

## Mechanisms to call

- [query_sprout_social_social_posts](/tools/query-sprout-social-social-posts.md)
- [query_hootsuite_social_posts](/tools/query-hootsuite-social-posts.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_social_media_analytics_dashboard_playbook](/tools/lookup-social-media-analytics-dashboard-playbook.md)
- [action_sprout_social_recommend](/tools/action-sprout-social-recommend.md)

## Success rubric

Action recommend executed against Sprout Social, with audit-trail entry and Social Media Mgr notified of outcomes.

# Citations

- [Social Media Analytics Dashboard Playbook](/documents/social-media-analytics-dashboard-playbook.md)
