---
type: Eval Scenario
title: Run the Content Performance Analyzer workflow for the current period. Cite th...
description: "Run the Content Performance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "content-performance-analyzer-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Content Performance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [data-aggregation](/queries/data-aggregation.md)

## Mechanisms to call

- [query_google_analytics_4_session_events](/tools/query-google-analytics-4-session-events.md)
- [query_hubspot_contacts](/tools/query-hubspot-contacts.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_content_performance_analyzer_playbook](/tools/lookup-content-performance-analyzer-playbook.md)
- [action_hubspot_recommend](/tools/action-hubspot-recommend.md)

## Success rubric

Action recommend executed against HubSpot, with audit-trail entry and Content Strategist notified of outcomes.

# Citations

- [Content Performance Analyzer Playbook](/documents/content-performance-analyzer-playbook.md)
