---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the DC Labor Planning Engine workflow.
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

Retrieve analytics events from BigQuery for the DC Labor Planning Engine workflow.

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

- [capacity_gap_scoring](/workflow/capacity-gap-scoring.md)

## Evals

- [Run the DC Labor Planning Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dc-labor-planning-engine-end-to-end.md)
- [Reconcile DC 22's freezer zone for wave 4417 on 2026-07-02: pick_tasks show pick_zone freezer averaging cases_per_hour of 58.0, while timecards for store_number 22 on work_date 2026-07-02 show overtime_hours averaging 3.6 per employee. labor_forecasts for store_number 22 shows earned_hours_standard of 640.0 against forecast_hours of 710.0, an 11% variance. Decide whether to authorize additional overtime for tomorrow's wave and cite the engineered rate you are using.](/tests/dc-labor-planning-engine-overtime-standard-reconciliation.md)

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
