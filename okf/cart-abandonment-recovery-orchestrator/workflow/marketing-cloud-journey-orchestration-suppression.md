---
type: Workflow Stage
title: "Marketing Cloud Journey Orchestration & Suppression"
description: "Draft and dispatch the chosen journey through Salesforce Marketing Cloud accounts and campaign_influence records (query_salesforce_marketing_cloud_accounts), suppressing any session whose cart_events log shows a complete_purchase or remove_from_cart event first."
source_id: marketing_cloud_journey_orchestration_suppression
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Marketing Cloud Journey Orchestration & Suppression

Draft and dispatch the chosen journey through Salesforce Marketing Cloud accounts and campaign_influence records (query_salesforce_marketing_cloud_accounts), suppressing any session whose cart_events log shows a complete_purchase or remove_from_cart event first.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cart_abandonment_recovery_orchestrator_execution_playbook](/tools/lookup-cart-abandonment-recovery-orchestrator-execution-playbook.md)
- [action_salesforce_commerce_cloud_send](/tools/action-salesforce-commerce-cloud-send.md)

Next: [Evidence-Gated Send & Audit](/workflow/evidence-gated-send-audit.md)
