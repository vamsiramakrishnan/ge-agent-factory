---
type: Proof Obligation
title: "Golden eval obligation — session_events record for session 74213099 shows zero results returned for 'quilted jacket' as of this morning, but bigquery historical_metrics last computed_at is from 30 hours ago and cached_aggregates still shows the old 14% null-rate baseline. Reconcile the two and tell me whether we should redirect 'quilted jacket' to the puffer-jacket category page."
description: golden eval proof obligation
source_id: "eval-site-search-relevance-engine-conflicting-staleness-reconciliation"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — session_events record for session 74213099 shows zero results returned for 'quilted jacket' as of this morning, but bigquery historical_metrics last computed_at is from 30 hours ago and cached_aggregates still shows the old 14% null-rate baseline. Reconcile the two and tell me whether we should redirect 'quilted jacket' to the puffer-jacket category page.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [site-search-relevance-engine-conflicting-staleness-reconciliation](/tests/site-search-relevance-engine-conflicting-staleness-reconciliation.md)


## Mechanisms

- [query_ga4_session_events](/tools/query-ga4-session-events.md)

## Entities that must be referenced

- session_events
- historical_metrics
- cached_aggregates

## Forbidden behaviors

- recommending the redirect rule using the stale historical_metrics/cached_aggregates as current evidence

# Citations

- [site-search-relevance-engine-execution-playbook](/documents/site-search-relevance-engine-execution-playbook.md)
