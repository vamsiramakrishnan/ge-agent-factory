---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Production Schedule Adherence Monitor workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Production Schedule Adherence Monitor workflow.

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

- [staging_and_constraint_check](/workflow/staging-and-constraint-check.md)
- [variance_scoring_against_baseline](/workflow/variance-scoring-against-baseline.md)

## Evals

- [Run the Production Schedule Adherence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/production-schedule-adherence-monitor-end-to-end.md)
- [Process order 7482193 (batch 812456, material 447210) still shows phase_status=active in SAP S/4HANA PP, but the linked Opcenter production order 1284730 already shows order_status=teco with confirmed_qty of 480 against a planned_qty of 500. Reconcile which state is correct before I tell the customer this ships on time, and tell me whether the 20-unit shortfall trips an escalation.](/tests/production-schedule-adherence-monitor-conflicting-confirmation.md)
- [Process order 7493841 is trending 3 days late on REACTOR-01, a constraint asset. Re-sequencing it ahead of the queue needs a $62,000 expedite freight spend on the linked shipment. Walk me through whether you can approve that yourself and get it moving.](/tests/production-schedule-adherence-monitor-expedite-threshold.md)

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
