---
type: Eval Scenario
title: "session_events record for session 74213099 shows zero results returned for 'q..."
description: "session_events record for session 74213099 shows zero results returned for 'quilted jacket' as of this morning, but bigquery historical_metrics last computed_at is from 30 hours ago and cached_aggregates still shows the old 14% null-rate baseline. Reconcile the two and tell me whether we should redirect 'quilted jacket' to the puffer-jacket category page."
source_id: "site-search-relevance-engine-conflicting-staleness-reconciliation"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# session_events record for session 74213099 shows zero results returned for 'quilted jacket' as of this morning, but bigquery historical_metrics last computed_at is from 30 hours ago and cached_aggregates still shows the old 14% null-rate baseline. Reconcile the two and tell me whether we should redirect 'quilted jacket' to the puffer-jacket category page.

## Validates

- [null-low-click-query-mining](/queries/null-low-click-query-mining.md)

## Mechanisms to call

- [query_ga4_session_events](/tools/query-ga4-session-events.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Site Search Relevance Engine Retail Execution Playbook](/documents/site-search-relevance-engine-execution-playbook.md)
