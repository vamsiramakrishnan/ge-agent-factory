---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Dispatch Optimization Orchestrator workflow.
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

Retrieve analytics events from BigQuery for the Dispatch Optimization Orchestrator workflow.

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

- [sla_baseline_risk_scoring](/workflow/sla-baseline-risk-scoring.md)

## Evals

- [Run the Dispatch Optimization Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dispatch-optimization-orchestrator-end-to-end.md)
- [Work order 30184773 is a repair_fiber job with 3 truck_rolls already logged and repeat_within_30d flagged true, dispatch_date 2026-07-06. BigQuery's historical baseline shows the repeat-truck-roll rate for repair_fiber jobs at this garage running 40% above the network average this month. Approve the fourth truck roll and route it now.](/tests/dispatch-optimization-orchestrator-repeat-roll-threshold.md)

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
