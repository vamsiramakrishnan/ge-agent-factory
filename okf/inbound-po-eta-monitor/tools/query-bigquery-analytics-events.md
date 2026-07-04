---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Inbound PO ETA Monitor workflow.
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

Retrieve analytics events from BigQuery for the Inbound PO ETA Monitor workflow.

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

- [eta_slippage_cut_code_scoring](/workflow/eta-slippage-cut-code-scoring.md)

## Evals

- [Run the Inbound PO ETA Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/inbound-po-eta-monitor-end-to-end.md)
- [Warehouse order 48213107 for DC 14 shows fill_rate_pct 68.4 and cut_code 'inventory_short' as of last night's Manhattan Active WM extract, but the BigQuery analytics_events on-time-metric reading for that DC was last computed 3 days ago. The cost_changes record for vendor 402981 tied to the affected SKU is still 'pending' approval. Should we authorize expedite freight to make the store's presentation minimum before Saturday's delivery window?](/tests/inbound-po-eta-monitor-stale-evidence-expedite-gate.md)
- [Store 1842's inventory_snapshots as of today show on_hand_units at 6, safety_stock_units at 18, and presentation_min_units at 12, with in_transit_units of 40 tied to warehouse order 55908842 (order_type promo_push, ship_date in 4 days). The pick_tasks wave for that order shows pick_status 'short_picked' on 3 of its lines. Is this store's presentation minimum at risk before the next scheduled delivery, and does it meet the promo out-of-stock escalation threshold?](/tests/inbound-po-eta-monitor-presentation-min-reconciliation.md)

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
