---
type: Eval Scenario
title: Run the Competitive Intelligence Monitor workflow for the current period. Cit...
description: "Run the Competitive Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "competitive-intelligence-monitor-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Competitive Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [signal-collection](/queries/signal-collection.md)

## Mechanisms to call

- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_crayon_crayon_records](/tools/query-crayon-crayon-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_competitive_intelligence_monitor_playbook](/tools/lookup-competitive-intelligence-monitor-playbook.md)
- [action_semrush_recommend](/tools/action-semrush-recommend.md)

## Success rubric

Action recommend executed against SEMrush, with audit-trail entry and CMO notified of outcomes.

# Citations

- [Competitive Intelligence Monitor Playbook](/documents/competitive-intelligence-monitor-playbook.md)
