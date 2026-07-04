---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Medical Bill Review Engine workflow.
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

Retrieve analytics events from BigQuery for the Medical Bill Review Engine workflow.

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

- [duplicate_upcoding_unbundling_detection](/workflow/duplicate-upcoding-unbundling-detection.md)

## Evals

- [Run the Medical Bill Review Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/medical-bill-review-engine-end-to-end.md)
- [Claim CLM-2026-014832 (workers_comp, jurisdiction_state TX) just received a UB-04 billing $18,400 for 22 units of CPT 97110 (therapeutic exercise) on date of service 2026-06-28. The claimant's billing history shows the same CPT code and date of service already billed under the claim's WC_medical exposure for $16,750 three weeks earlier. Reconcile the two submissions, determine whether this is a duplicate, upcoded, or unbundled charge, and recommend pay, reduce, or deny per line.](/tests/medical-bill-review-engine-duplicate-reconciliation.md)

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
