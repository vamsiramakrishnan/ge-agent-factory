---
type: Workflow Stage
title: Retrieve Records
description: "Query online orders and product catalog entries from Salesforce Commerce Cloud and correlate with Manhattan Active WM for the Click-and-Collect SLA Monitor workflow."
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query online orders and product catalog entries from Salesforce Commerce Cloud and correlate with Manhattan Active WM for the Click-and-Collect SLA Monitor workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [lookup_click_and_collect_sla_monitor_execution_playbook](/tools/lookup-click-and-collect-sla-monitor-execution-playbook.md)
- [action_salesforce_commerce_cloud_escalate](/tools/action-salesforce-commerce-cloud-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
