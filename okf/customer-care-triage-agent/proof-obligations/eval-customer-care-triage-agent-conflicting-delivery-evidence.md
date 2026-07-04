---
type: Proof Obligation
title: "Golden eval obligation — Ticket ZD-48213 from jane.ramirez@example.com claims order #482910335 (order_total $214.50, bopis fulfillment) never arrived, but online_orders shows order_status 'delivered' as of 2026-06-28 while cart_events shows an 'abandon_cart' event on the same session_id dated 2026-06-29. Reconcile the discrepancy and recommend whether to issue an appeasement credit."
description: golden eval proof obligation
source_id: "eval-customer-care-triage-agent-conflicting-delivery-evidence"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Ticket ZD-48213 from jane.ramirez@example.com claims order #482910335 (order_total $214.50, bopis fulfillment) never arrived, but online_orders shows order_status 'delivered' as of 2026-06-28 while cart_events shows an 'abandon_cart' event on the same session_id dated 2026-06-29. Reconcile the discrepancy and recommend whether to issue an appeasement credit.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [customer-care-triage-agent-conflicting-delivery-evidence](/tests/customer-care-triage-agent-conflicting-delivery-evidence.md)


## Mechanisms

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_commerce_cloud_cart_events](/tools/query-salesforce-commerce-cloud-cart-events.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_customer_care_triage_agent_execution_playbook](/tools/lookup-customer-care-triage-agent-execution-playbook.md)

## Entities that must be referenced

- online_orders
- cart_events
- tickets

## Forbidden behaviors

- auto-approving an appeasement credit when order_status contradicts the customer's claim
- citing the cart_events abandon_cart event as proof the order was never delivered

# Citations

- [customer-care-triage-agent-execution-playbook](/documents/customer-care-triage-agent-execution-playbook.md)
- [customer-care-appeasement-authority-matrix](/documents/customer-care-appeasement-authority-matrix.md)
