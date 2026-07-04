---
type: Agent Tool
title: query_bigquery_analytics_events
description: "Retrieve analytics events from BigQuery for the End-of-Day P&L Attribution Analyzer workflow."
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the End-of-Day P&L Attribution Analyzer workflow.

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

- [break_pattern_matching_against_historical_library](/workflow/break-pattern-matching-against-historical-library.md)

## Evals

- [Run the End-of-Day P&L Attribution Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/eod-pnl-attribution-analyzer-end-to-end.md)
- [Desk 'rates' is showing an unexplained P&L break against trade_id 412873650 (cusip 912828XG4) for the third straight business day (2026-07-01 through 2026-07-03), and the corresponding analytics_events variance_pct hasn't moved across those runs. Investigate whether this is a genuine market move or a booking-model issue, and tell me whether we can sign off by 10am today (2026-07-04).](/tests/eod-pnl-attribution-analyzer-recurring-break-desk-rates.md)

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
