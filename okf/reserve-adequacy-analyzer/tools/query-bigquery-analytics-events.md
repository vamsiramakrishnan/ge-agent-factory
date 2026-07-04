---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Reserve Adequacy Analyzer workflow.
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

Retrieve analytics events from BigQuery for the Reserve Adequacy Analyzer workflow.

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

- [loss_triangle_assembly_reconciliation](/workflow/loss-triangle-assembly-reconciliation.md)
- [development_method_diagnostics](/workflow/development-method-diagnostics.md)

## Evals

- [Run the Reserve Adequacy Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/reserve-adequacy-analyzer-end-to-end.md)
- [For the commercial_property segment, analytics_events last computed_at is 2026-06-30 but today is 2026-07-04 and historical_metrics baseline hasn't refreshed since 2026-06-15. The draft IBNR range you're about to publish is plus-or-minus 11%, right at the edge of our plus-or-minus 12%-to-plus-or-minus 6% target band. Should we publish it in this quarter's exhibit, and what needs to happen first?](/tests/reserve-adequacy-analyzer-stale-evidence-ibnr-edge.md)

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
