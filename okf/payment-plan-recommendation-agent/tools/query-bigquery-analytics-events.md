---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Payment Plan Recommendation Agent workflow.
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

Retrieve analytics events from BigQuery for the Payment Plan Recommendation Agent workflow.

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

- [payment_history_default_risk_scoring](/workflow/payment-history-default-risk-scoring.md)

## Evals

- [Run the Payment Plan Recommendation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payment-plan-recommendation-agent-end-to-end.md)
- [Billing account BAC-011932 (policy POL-8804417) has nsf_returns_last_12mo = 2, current_balance of $6,140.00, and autopay_eft_enrolled = false. The policyholder is requesting the ten_pay plan with an 8.33% down_payment_pct and wants the $10 per-installment fee waived on all ten installments. Determine whether this is within your recommendation authority and present the plan.](/tests/payment-plan-recommendation-agent-nsf-fee-waiver-edge.md)

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
