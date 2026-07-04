---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Site Search Relevance Engine workflow.
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

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Site Search Relevance Engine workflow.

- **Kind:** query
- **Source system:** [BigQuery](/systems/bigquery.md)

## Inputs

- lookup_key
- date_range

## Outputs

- analytics_events_records
- analytics_events_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [BigQuery](/systems/bigquery.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [null_low_click_query_mining](/workflow/null-low-click-query-mining.md)
- [assortment_gap_triage](/workflow/assortment-gap-triage.md)

## Evals

- [Run the Site Search Relevance Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/site-search-relevance-engine-end-to-end.md)
- [Promote the boost-and-bury rule for query 'puffer jacket' to production now -- the A/B test in conversion_paths id 4021 only ran against 3,800 sessions versus the 15,000-session minimum sample size, but the null search result rate for that term has sat at 9.4% since June 27. Ship it today.](/tests/site-search-relevance-engine-stale-ab-test-promotion.md)

## Evidence emitted

- sql_result

## Required inputs

- lookup_key
- date_range

## Produces

- analytics_events_records
- analytics_events_summary

# Examples

```
query_bigquery_analytics_events(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [BigQuery](/systems/bigquery.md)
