---
type: Agent Tool
title: query_ga4_session_events
description: Retrieve session events from GA4 for the Site Search Relevance Engine workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ga4_session_events

Retrieve session events from GA4 for the Site Search Relevance Engine workflow.

- **Kind:** query
- **Source system:** [GA4](/systems/ga4.md)

## Inputs

- lookup_key
- date_range

## Outputs

- session_events_records
- session_events_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [GA4](/systems/ga4.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [null_low_click_query_mining](/workflow/null-low-click-query-mining.md)
- [assortment_gap_triage](/workflow/assortment-gap-triage.md)
- [a_b_test_gating_evidence_validation](/workflow/a-b-test-gating-evidence-validation.md)

## Evals

- [Run the Site Search Relevance Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/site-search-relevance-engine-end-to-end.md)
- [session_events record for session 74213099 shows zero results returned for 'quilted jacket' as of this morning, but bigquery historical_metrics last computed_at is from 30 hours ago and cached_aggregates still shows the old 14% null-rate baseline. Reconcile the two and tell me whether we should redirect 'quilted jacket' to the puffer-jacket category page.](/tests/site-search-relevance-engine-conflicting-staleness-reconciliation.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- session_events_records
- session_events_summary

# Examples

```
query_ga4_session_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [GA4](/systems/ga4.md)
