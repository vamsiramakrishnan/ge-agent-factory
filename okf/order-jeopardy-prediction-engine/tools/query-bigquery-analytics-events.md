---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Order Jeopardy Prediction Engine workflow.
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

Retrieve analytics events from BigQuery for the Order Jeopardy Prediction Engine workflow.

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

- [baseline_comparison_slip_scoring](/workflow/baseline-comparison-slip-scoring.md)

## Evals

- [Run the Order Jeopardy Prediction Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/order-jeopardy-prediction-engine-end-to-end.md)
- [Order 7433981 (enterprise, port_in) shows fallout_status=inventory_shortfall in service_orders with due_date 2026-07-15, but the linked provisioning_task snapshot in the queue is over 40 hours old, and network_inventory_items shows the target network element already sitting in decommission_pending admin_state at 96.4% capacity_utilization_pct. BigQuery analytics_events still shows negative variance_pct for this segment's on-time delivery metric. Determine whether this order's jeopardy score is trustworthy and recommend the next action before any draft is issued.](/tests/order-jeopardy-prediction-engine-stale-evidence-conflict.md)

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
