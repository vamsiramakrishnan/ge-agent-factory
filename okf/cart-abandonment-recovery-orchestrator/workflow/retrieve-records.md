---
type: Workflow Stage
title: Retrieve Records
description: Query online orders and product catalog entries from Salesforce Commerce Cloud and correlate with Salesforce Marketing Cloud for the Cart Abandonment Recovery Orchestrator workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query online orders and product catalog entries from Salesforce Commerce Cloud and correlate with Salesforce Marketing Cloud for the Cart Abandonment Recovery Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [lookup_cart_abandonment_recovery_orchestrator_execution_playbook](/tools/lookup-cart-abandonment-recovery-orchestrator-execution-playbook.md)
- [action_salesforce_commerce_cloud_send](/tools/action-salesforce-commerce-cloud-send.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
