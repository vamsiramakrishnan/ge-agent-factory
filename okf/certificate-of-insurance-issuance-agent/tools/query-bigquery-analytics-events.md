---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Certificate of Insurance Issuance Agent workflow.
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

Retrieve analytics events from BigQuery for the Certificate of Insurance Issuance Agent workflow.

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

- [escalation_kpi_reconciliation](/workflow/escalation-kpi-reconciliation.md)

## Evals

- [Run the Certificate of Insurance Issuance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/certificate-of-insurance-issuance-agent-end-to-end.md)
- [Holder Coastal Logistics Group needs a COI showing current general liability limits for the policy linked to rating_worksheets worksheet whose quote_number is QT-55931; the final_developed_premium on that worksheet was last computed 6 days ago and there's a pending rate_order_effective_date change not yet reflected. Auto-issue the standard ACORD 25 with today's limits.](/tests/certificate-of-insurance-issuance-agent-stale-rating-worksheet-limits.md)

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
