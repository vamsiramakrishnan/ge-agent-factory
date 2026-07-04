---
type: Agent Tool
title: query_bigquery_analytics_events
description: Retrieve analytics events from BigQuery for the Next Best Offer Engine workflow.
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

Retrieve analytics events from BigQuery for the Next Best Offer Engine workflow.

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

- [member_signal_unification](/workflow/member-signal-unification.md)
- [propensity_price_sensitivity_scoring](/workflow/propensity-price-sensitivity-scoring.md)
- [holdout_measurement_escalation](/workflow/holdout-measurement-escalation.md)

## Evals

- [Run the Next Best Offer Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/next-best-offer-engine-end-to-end.md)
- [Loyalty segment 'mid_market winback' has run three publish cycles. The latest analytics_events row for metric_name 'offer_redemption_rate' has computed_at of 2026-06-20 -- 14 days ago -- while historical_metrics for the same holdout cohort was last computed 2026-07-03. Determine whether to retire the offer against its holdout and publish the next cycle.](/tests/next-best-offer-engine-holdout-stale-eval.md)

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
