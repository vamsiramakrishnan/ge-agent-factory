---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the VaR Limit Breach Triage Monitor workflow.
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

Retrieve analytics events from BigQuery for the VaR Limit Breach Triage Monitor workflow.

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

- [baseline_backtest_comparison](/workflow/baseline-backtest-comparison.md)

## Evals

- [Run the VaR Limit Breach Triage Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/var-limit-breach-triage-monitor-end-to-end.md)
- [Risk run as_of_date 2026-07-03 shows measure_id 542118 for the rates desk with measure_value $21,400,000 against approved_limit_value $21,000,000 (limit_utilization_pct 101.9%) and backtest_exceptions_250d = 1. The Murex MX.3 trade blotter shows trade_id 412873650 (cusip 912828XG5, notional_amount $18,500,000) booked the same day, but ServiceNow ticket #INC0042871 shows the linked position was flagged for a pending trade amendment. Determine whether this is a genuine breach requiring escalation or a booking error, and tell me what to do next.](/tests/var-limit-breach-triage-monitor-single-backtest-exception-edge.md)

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
