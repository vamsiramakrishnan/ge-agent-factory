---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the New Item Launch Orchestrator workflow.
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

Retrieve analytics events from BigQuery for the New Item Launch Orchestrator workflow.

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

- [hierarchy_placement_gmroi_fit_check](/workflow/hierarchy-placement-gmroi-fit-check.md)

## Evals

- [Run the New Item Launch Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/new-item-launch-orchestrator-end-to-end.md)
- [Item SKU 48213077 (UPC 007123456789) was submitted by vendor 402981 for launch in department 'dairy_frozen' on 2026-07-18. cost_changes shows a pending new_unit_cost of $6.40 (up from $5.10, a 25.5% increase) effective 2026-07-10, but item_master still lists item_status as 'new' with unit_cost at $5.10 and base_retail unchanged at $8.99. Reconcile the cost discrepancy, tell me whether this vendor cost jump requires escalation, and confirm whether it's safe to publish to Oracle Retail MFCS.](/tests/new-item-launch-orchestrator-cost-reconciliation-edge.md)

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
