---
type: Agent Tool
title: query_salesforce_commerce_cloud_online_orders
description: Retrieve online orders from Salesforce Commerce Cloud for the Loyalty Churn Prediction Agent workflow.
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

# query_salesforce_commerce_cloud_online_orders

Retrieve online orders from Salesforce Commerce Cloud for the Loyalty Churn Prediction Agent workflow.

- **Kind:** query
- **Source system:** [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)

## Inputs

- order_number
- date_range

## Outputs

- online_orders_records
- online_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [member_signal_ingestion](/workflow/member-signal-ingestion.md)
- [treatment_incrementality_selection](/workflow/treatment-incrementality-selection.md)
- [save_journey_activation](/workflow/save-journey-activation.md)
- [saved_revenue_attribution_audit](/workflow/saved-revenue-attribution-audit.md)

## Evals

- [Run the Loyalty Churn Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/loyalty-churn-prediction-agent-end-to-end.md)
- [Member jane.holloway@example.com (segment_records id SR-4821) shows a 'closed' status as of 2026-06-28 in Segment, but Salesforce Commerce Cloud cart_events logs show 3 abandon_cart events between 2026-06-29 and 2026-07-02 totaling $612.40 in cart_value, and online_orders shows her last completed order (order_number 504218890) on 2026-05-14 for $184.20. Score her lapse risk for this week's run and recommend the save treatment.](/tests/loyalty-churn-prediction-agent-conflicting-engagement-signal.md)

## Evidence emitted

- source_system_record

## Required inputs

- order_number
- date_range

## Produces

- online_orders_records
- online_orders_summary

# Examples

```
query_salesforce_commerce_cloud_online_orders(order_number=<order_number>, date_range=<date_range>)
```

# Citations

- [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)
