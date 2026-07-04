---
type: Eval Scenario
title: "Run the Technology Radar & Trend Scout workflow for the current period. Cite ..."
description: "Run the Technology Radar & Trend Scout workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "technology-radar-trend-scout-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Technology Radar & Trend Scout workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [signal-collection](/queries/signal-collection.md)

## Mechanisms to call

- [query_github_pull_requests](/tools/query-github-pull-requests.md)
- [query_gartner_api_gartner_api_records](/tools/query-gartner-api-gartner-api-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_technology_radar_trend_scout_runbook](/tools/lookup-technology-radar-trend-scout-runbook.md)
- [action_github_update](/tools/action-github-update.md)

## Success rubric

Action update executed against GitHub, with audit-trail entry and CIO / CTO notified of outcomes.

# Citations

- [Technology Radar & Trend Scout Operations Runbook](/documents/technology-radar-trend-scout-runbook.md)
