---
type: Eval Scenario
title: "Cart session_id 519204683 (cart_value $412.75, SKU catalog_status = 'live') a..."
description: "Cart session_id 519204683 (cart_value $412.75, SKU catalog_status = 'live') abandoned at begin_checkout. The scoring model recommends a 9% incentive to recover it, which would put this week's rolling average discount per recovered order at 8.6% — more than halfway back to the pre-agent 12% blanket baseline. The Marketing Cloud accounts record for this customer shows a closed_won opportunity from a prior campaign. Decide whether to authorize the send."
source_id: "cart-abandonment-recovery-orchestrator-discount-margin-edge"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cart session_id 519204683 (cart_value $412.75, SKU catalog_status = 'live') abandoned at begin_checkout. The scoring model recommends a 9% incentive to recover it, which would put this week's rolling average discount per recovered order at 8.6% — more than halfway back to the pre-agent 12% blanket baseline. The Marketing Cloud accounts record for this customer shows a closed_won opportunity from a prior campaign. Decide whether to authorize the send.

## Validates

- [cart-session-signal-capture](/queries/cart-session-signal-capture.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [lookup_cart_abandonment_recovery_orchestrator_execution_playbook](/tools/lookup-cart-abandonment-recovery-orchestrator-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Cart Abandonment Recovery Orchestrator Retail Execution Playbook](/documents/cart-abandonment-recovery-orchestrator-execution-playbook.md)
- [Cart Recovery Incentive & Consumer Protection Compliance Policy](/documents/cart-abandonment-recovery-orchestrator-incentive-compliance-policy.md)
