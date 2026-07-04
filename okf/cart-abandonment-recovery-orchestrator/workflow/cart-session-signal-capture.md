---
type: Workflow Stage
title: "Cart & Session Signal Capture"
description: "Pull fresh cart_events and online_orders from Salesforce Commerce Cloud (query_salesforce_commerce_cloud_online_orders) and cross-reference Segment segment_records for session-level intent and device signals before any scoring begins."
source_id: cart_session_signal_capture
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cart & Session Signal Capture

Pull fresh cart_events and online_orders from Salesforce Commerce Cloud (query_salesforce_commerce_cloud_online_orders) and cross-reference Segment segment_records for session-level intent and device signals before any scoring begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cart_abandonment_recovery_orchestrator_execution_playbook](/tools/lookup-cart-abandonment-recovery-orchestrator-execution-playbook.md)
- [action_salesforce_commerce_cloud_send](/tools/action-salesforce-commerce-cloud-send.md)

Next: [Intent, Margin & Stock-Risk Scoring](/workflow/intent-margin-stock-risk-scoring.md)
