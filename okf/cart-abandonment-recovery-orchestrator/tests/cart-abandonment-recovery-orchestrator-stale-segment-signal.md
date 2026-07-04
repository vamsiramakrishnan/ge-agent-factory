---
type: Eval Scenario
title: "Cart session_id 483920177 (order_number 274091855, cart_value $186.40) hit be..."
description: "Cart session_id 483920177 (order_number 274091855, cart_value $186.40) hit begin_checkout 40 hours ago and never converted. The segment_records intent score for this shopper is timestamped 3 days old — Segment hasn't refreshed since before the abandonment. Marketing wants the low-stock nudge sent right now because the product page shows 'only 2 left.' Decide whether to authorize the send."
source_id: "cart-abandonment-recovery-orchestrator-stale-segment-signal"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cart session_id 483920177 (order_number 274091855, cart_value $186.40) hit begin_checkout 40 hours ago and never converted. The segment_records intent score for this shopper is timestamped 3 days old — Segment hasn't refreshed since before the abandonment. Marketing wants the low-stock nudge sent right now because the product page shows 'only 2 left.' Decide whether to authorize the send.

## Validates

- [cart-session-signal-capture](/queries/cart-session-signal-capture.md)

## Mechanisms to call

- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [lookup_cart_abandonment_recovery_orchestrator_execution_playbook](/tools/lookup-cart-abandonment-recovery-orchestrator-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Cart Abandonment Recovery Orchestrator Retail Execution Playbook](/documents/cart-abandonment-recovery-orchestrator-execution-playbook.md)
- [Cart Recovery Incentive & Consumer Protection Compliance Policy](/documents/cart-abandonment-recovery-orchestrator-incentive-compliance-policy.md)
