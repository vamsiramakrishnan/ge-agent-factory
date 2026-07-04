---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Deposit Attrition Early Warning Monitor workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bigquery_analytics_events

Retrieve analytics events from BigQuery for the Deposit Attrition Early Warning Monitor workflow.

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

- [baseline_rate_spread_reconciliation](/workflow/baseline-rate-spread-reconciliation.md)

## Evals

- [Run the Deposit Attrition Early Warning Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/deposit-attrition-early-warning-monitor-end-to-end.md)
- [Account_number 52938471 in core_accounts shows current_balance fell from $184,300.00 to $61,750.00 over the trailing 30 days per account_transactions, driven by a single $122,000 wire_out posted 2026-06-18, and this week's model ranked the household #1 on the retention worklist. Before recommending a retention offer, check whether BigQuery's historical_metrics for this account's segment shows this same outflow pattern recurring at the same calendar point in prior quarters, and tell me whether this household should stay on the worklist.](/tests/deposit-attrition-early-warning-monitor-inflow-outflow-conflict.md)
- [Joint household account_numbers 63102284 and 63102285 in core_accounts have combined current_balance of $248,600.00, just under the $250,000 escalation threshold individually, but their analytics_events segment record shows computed_at 40 hours ago with variance_pct of -18% against historical_metrics. Today's retention worklist recommends a rate-matching offer for this household. Decide whether to publish the offer now via action_temenos_transact_publish or hold, and state the next steps.](/tests/deposit-attrition-early-warning-monitor-threshold-stale-evidence.md)

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
