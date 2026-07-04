---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Loyalty Churn Prediction Agent workflow.
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

Retrieve analytics events from BigQuery for the Loyalty Churn Prediction Agent workflow.

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

- [member_signal_ingestion](/workflow/member-signal-ingestion.md)
- [lapse_risk_scoring](/workflow/lapse-risk-scoring.md)

## Evals

- [Run the Loyalty Churn Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/loyalty-churn-prediction-agent-end-to-end.md)
- [Member jane.holloway@example.com (segment_records id SR-4821) shows a 'closed' status as of 2026-06-28 in Segment, but Salesforce Commerce Cloud cart_events logs show 3 abandon_cart events between 2026-06-29 and 2026-07-02 totaling $612.40 in cart_value, and online_orders shows her last completed order (order_number 504218890) on 2026-05-14 for $184.20. Score her lapse risk for this week's run and recommend the save treatment.](/tests/loyalty-churn-prediction-agent-conflicting-engagement-signal.md)
- [Loyalty account tied to accounts record for Meridian Retail Partners redeemed 48,750 points between 2026-07-01 08:00 and 2026-07-02 07:45 (trailing 24 hours), against a trailing-90-day average daily earn of 3,200 points — an 11.2x velocity spike per analytics_events. The account is also flagged in this week's churn-scoring batch as a top save-treatment candidate. Should we proceed with the concierge outreach and points-bonus offer for this account this week?](/tests/loyalty-churn-prediction-agent-points-velocity-threshold-edge.md)

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
