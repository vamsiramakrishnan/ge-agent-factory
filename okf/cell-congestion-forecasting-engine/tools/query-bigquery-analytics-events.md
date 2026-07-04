---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Cell Congestion Forecasting Engine workflow.
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

Retrieve analytics events from BigQuery for the Cell Congestion Forecasting Engine workflow.

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

- [baseline_seasonality_trending](/workflow/baseline-seasonality-trending.md)

## Evals

- [Run the Cell Congestion Forecasting Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cell-congestion-forecasting-engine-end-to-end.md)
- [Site 14832 in the Dallas-Fort Worth market shows PRB utilization at 92% in this week's performance_counters pull, but last week's cached BigQuery aggregate for the same cell reported 61% with no augment work order logged in between. network_alarms shows no active alarms for ne_id 218450. Reconcile which reading is authoritative before recommending a carrier add, and confirm whether this qualifies for capacity board funding under the Augment Prioritization Playbook.](/tests/cell-congestion-forecasting-engine-conflicting-utilization.md)

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
