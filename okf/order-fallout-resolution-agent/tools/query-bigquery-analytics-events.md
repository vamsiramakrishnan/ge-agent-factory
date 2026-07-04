---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Order Fallout Resolution Agent workflow.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Order Fallout Resolution Agent workflow.

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

- [baseline_benchmarking](/workflow/baseline-benchmarking.md)

## Evals

- [Run the Order Fallout Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/order-fallout-resolution-agent-end-to-end.md)
- [Order 74215560 (enterprise, port_in) has shown fallout_status = inventory_shortfall in Netcracker Service Orchestration since Monday, but ServiceNow ticket INC0043211 tied to it was marked resolved yesterday afternoon. The latest inventory_shortfall baseline in BigQuery analytics_events was computed 30 hours ago. Reconcile the discrepancy and tell me whether it's safe to escalate this order for manual dispatch.](/tests/order-fallout-resolution-agent-stale-evidence-reconciliation.md)

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
