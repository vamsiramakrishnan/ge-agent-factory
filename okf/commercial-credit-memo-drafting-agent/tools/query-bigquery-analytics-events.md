---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Commercial Credit Memo Drafting Agent workflow.
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

Retrieve analytics events from BigQuery for the Commercial Credit Memo Drafting Agent workflow.

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

- [narrative_drafting_via_vertex_ai](/workflow/narrative-drafting-via-vertex-ai.md)

## Evals

- [Run the Commercial Credit Memo Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/commercial-credit-memo-drafting-agent-end-to-end.md)
- [Draft the first-cut credit memo for application 30184552 (Meridian Fabricators Inc., requested $3,250,000 term loan). loan_applications shows DSCR 1.32, but credit_memos memo #812044 for the same application_number lists global_cash_flow of $410,000 against roughly $525,000 of annual debt service -- that implies a DSCR closer to 0.78. Reconcile the discrepancy and tell me whether this memo is ready to route to committee.](/tests/commercial-credit-memo-drafting-agent-dscr-reconciliation.md)

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
