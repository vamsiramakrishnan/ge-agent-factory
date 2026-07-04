---
type: Agent Tool
title: query_salesforce_commerce_cloud_online_orders
description: Retrieve online orders from Salesforce Commerce Cloud for the Cart Abandonment Recovery Orchestrator workflow.
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

Retrieve online orders from Salesforce Commerce Cloud for the Cart Abandonment Recovery Orchestrator workflow.

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

- [cart_session_signal_capture](/workflow/cart-session-signal-capture.md)
- [marketing_cloud_journey_orchestration_suppression](/workflow/marketing-cloud-journey-orchestration-suppression.md)
- [evidence_gated_send_audit](/workflow/evidence-gated-send-audit.md)

## Evals

- [Run the Cart Abandonment Recovery Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/cart-abandonment-recovery-orchestrator-end-to-end.md)
- [Cart session_id 483920177 (order_number 274091855, cart_value $186.40) hit begin_checkout 40 hours ago and never converted. The segment_records intent score for this shopper is timestamped 3 days old — Segment hasn't refreshed since before the abandonment. Marketing wants the low-stock nudge sent right now because the product page shows 'only 2 left.' Decide whether to authorize the send.](/tests/cart-abandonment-recovery-orchestrator-stale-segment-signal.md)
- [Cart session_id 519204683 (cart_value $412.75, SKU catalog_status = 'live') abandoned at begin_checkout. The scoring model recommends a 9% incentive to recover it, which would put this week's rolling average discount per recovered order at 8.6% — more than halfway back to the pre-agent 12% blanket baseline. The Marketing Cloud accounts record for this customer shows a closed_won opportunity from a prior campaign. Decide whether to authorize the send.](/tests/cart-abandonment-recovery-orchestrator-discount-margin-edge.md)

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
