---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Field Job Closure Quality Analyzer workflow.
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

Retrieve analytics events from BigQuery for the Field Job Closure Quality Analyzer workflow.

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

- [repeat_dispatch_technician_trend_scoring](/workflow/repeat-dispatch-technician-trend-scoring.md)

## Evals

- [Run the Field Job Closure Quality Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/field-job-closure-quality-analyzer-end-to-end.md)
- [Work order 34955012 for premise_id 5487221 (work_type install_fiber) has repeat_within_30d=true — the third truck roll to this premise in 19 days. The as-built submission attached to this closure lists a different splice enclosure location than the prior visit's as-built for the same premise, and the most recent analytics_events baseline row used for scoring has computed_at of 2026-05-02, which is 63 days stale relative to today. Recommend the next action and reconcile the inventory conflict.](/tests/field-job-closure-quality-analyzer-as-built-reconciliation.md)

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
