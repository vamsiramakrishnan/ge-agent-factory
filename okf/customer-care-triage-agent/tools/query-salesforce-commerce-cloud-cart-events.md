---
type: Agent Tool
title: query_salesforce_commerce_cloud_cart_events
description: Retrieve cart events from Salesforce Commerce Cloud for the Customer Care Triage Agent workflow.
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

# query_salesforce_commerce_cloud_cart_events

Retrieve cart events from Salesforce Commerce Cloud for the Customer Care Triage Agent workflow.

- **Kind:** query
- **Source system:** [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)

## Inputs

- session_id
- sku
- date_range

## Outputs

- cart_events_records

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

_Not bound to a workflow stage._

## Evals

- [Ticket ZD-48213 from jane.ramirez@example.com claims order #482910335 (order_total $214.50, bopis fulfillment) never arrived, but online_orders shows order_status 'delivered' as of 2026-06-28 while cart_events shows an 'abandon_cart' event on the same session_id dated 2026-06-29. Reconcile the discrepancy and recommend whether to issue an appeasement credit.](/tests/customer-care-triage-agent-conflicting-delivery-evidence.md)

## Evidence emitted

- source_system_record

## Required inputs

- session_id
- sku
- date_range

## Produces

- cart_events_records

# Examples

```
query_salesforce_commerce_cloud_cart_events(session_id=<session_id>, sku=<sku>, date_range=<date_range>)
```

# Citations

- [Salesforce Commerce Cloud](/systems/salesforce-commerce-cloud.md)
