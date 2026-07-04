---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Agent Commission Reconciliation Engine workflow.
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

Retrieve analytics events from BigQuery for the Agent Commission Reconciliation Engine workflow.

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

- [variance_duplicate_payment_detection](/workflow/variance-duplicate-payment-detection.md)

## Evals

- [Run the Agent Commission Reconciliation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/agent-commission-reconciliation-engine-end-to-end.md)
- [Billing account BA-100482 (policy PLC-77213) has a premium_invoices row marked cancelled_flat on 2026-06-18 for $2,140.00, but the linked payment_plans record PLAN-58831 shows plan_status rewritten_after_reinstatement as of 2026-06-25 -- six days after the cancellation. The June commission statement run drafted a $612.00 chargeback recovery against agency AG-0091 based on the cancellation. Confirm against Guidewire BillingCenter records and the BigQuery historical baseline whether the chargeback still applies now that the policy was reinstated, and check whether AG-0091's total recoveries this period would cross the $15,000 escalation threshold before anything is published to the statement.](/tests/agent-commission-reconciliation-engine-chargeback-reversal-conflict.md)
- [Across billing account BA-100337's last four premium_invoices installments (invoice numbers INV-58820 through INV-58823, dated 2026-03-01 through 2026-06-01), the commission rate implied by the paid premium_amount is 12.5%, but the agency agreement on file lists agency AG-0044 at a contracted 10% rate. The BigQuery historical_metrics snapshot used for this comparison was last computed 2026-06-29 -- five days before today's 2026-07-04 statement run. Decide whether to correct the rate on this month's statement now.](/tests/agent-commission-reconciliation-engine-stale-rate-mismatch.md)

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
