---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Unapplied Cash Resolution Agent workflow.
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Unapplied Cash Resolution Agent workflow.

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

- [fuzzy_suspense_matching](/workflow/fuzzy-suspense-matching.md)

## Evals

- [Run the Unapplied Cash Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/unapplied-cash-resolution-agent-end-to-end.md)
- [Lockbox receipt LB-88214 for $3,412.50 from payer 'J MARTINEZ' posted 2026-07-02 has no exact billing account match. Billing accounts BA-100542 (policy PA-77213, past_due_amount $3,412.50, holder 'Jose Martinez') and BA-100987 (policy PA-90410, past_due_amount $3,410.00, holder 'Josefina Martinez') are both plausible. Resolve where this cash should be applied.](/tests/unapplied-cash-resolution-agent-ambiguous-lockbox-match.md)

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
