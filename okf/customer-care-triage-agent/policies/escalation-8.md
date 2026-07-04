---
type: Policy
title: Escalation policy 8
description: "When A P1 ticket's linked online_orders.order_status is still 'placed' or 'picking' more than double the interval to promised_delivery_date, or the most recent online_orders query is more than 24 hours old; action: request_more_info; handoff: fulfillment_operations"
source_id: "escalation-8"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A P1 ticket's linked online_orders.order_status is still 'placed' or 'picking' more than double the interval to promised_delivery_date, or the most recent online_orders query is more than 24 hours old | request_more_info | fulfillment_operations | A P1 ticket sitting on stale or unresolved fulfillment status likely reflects a fulfillment failure, not a routine delay, and needs a fresh systems-of-record check before any resolution or credit is offered. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
