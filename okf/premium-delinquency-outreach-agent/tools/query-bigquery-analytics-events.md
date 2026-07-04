---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Premium Delinquency Outreach Agent workflow.
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

Retrieve analytics events from BigQuery for the Premium Delinquency Outreach Agent workflow.

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

- [cure_probability_scoring](/workflow/cure-probability-scoring.md)

## Evals

- [Run the Premium Delinquency Outreach Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/premium-delinquency-outreach-agent-end-to-end.md)
- [Billing account BA-2024-118837 (policy PL-994102) shows account_status = pending_cancel_nonpay in Guidewire BillingCenter with a past-due amount of $1,840.55, but the linked payment_plans record PLAN-55219 shows plan_status = active with 4 installments_remaining and a next_installment_date of 2026-07-18. Marketing wants to send the final cancellation notice through Salesforce Marketing Cloud today. Should we proceed?](/tests/premium-delinquency-outreach-agent-plan-status-conflict.md)
- [Billing account BA-2024-204471 has autopay_eft_enrolled = true but nsf_returns_last_12mo = 2, with the most recent NSF on 2026-06-30 and a current_balance of $3,120.40. The nightly BigQuery cure-probability refresh for this account last completed 2026-07-01T22:00:00Z (over 33 hours ago) and currently scores it high-cure-probability, low-priority. The dunning campaign wants to skip the card-update prompt, auto-re-enroll the account in autopay using the card on file, and close it out as self-cured. Walk through whether this is compliant.](/tests/premium-delinquency-outreach-agent-autopay-failure-stale-score.md)

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
