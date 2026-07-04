---
type: Eval Scenario
title: Run the Cart Abandonment Recovery Orchestrator workflow for the current perio...
description: "Run the Cart Abandonment Recovery Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "cart-abandonment-recovery-orchestrator-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Cart Abandonment Recovery Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cart-session-signal-capture](/queries/cart-session-signal-capture.md)

## Mechanisms to call

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cart_abandonment_recovery_orchestrator_execution_playbook](/tools/lookup-cart-abandonment-recovery-orchestrator-execution-playbook.md)
- [action_salesforce_commerce_cloud_send](/tools/action-salesforce-commerce-cloud-send.md)

## Success rubric

Action send executed against Salesforce Commerce Cloud, with audit-trail entry and Digital Marketing Manager notified of outcomes.

# Citations

- [Cart Abandonment Recovery Orchestrator Retail Execution Playbook](/documents/cart-abandonment-recovery-orchestrator-execution-playbook.md)
