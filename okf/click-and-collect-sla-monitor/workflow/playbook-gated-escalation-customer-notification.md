---
type: Workflow Stage
title: "Playbook-Gated Escalation & Customer Notification"
description: "Cite the Click-and-Collect SLA Monitor Retail Execution Playbook (lookup_click_and_collect_sla_monitor_execution_playbook) before escalating at-risk orders to store leadership or rerouting overflow via action_salesforce_commerce_cloud_escalate, then notify the customer of the accurate ready time."
source_id: playbook_gated_escalation_customer_notification
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Playbook-Gated Escalation & Customer Notification

Cite the Click-and-Collect SLA Monitor Retail Execution Playbook (lookup_click_and_collect_sla_monitor_execution_playbook) before escalating at-risk orders to store leadership or rerouting overflow via action_salesforce_commerce_cloud_escalate, then notify the customer of the accurate ready time.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [lookup_click_and_collect_sla_monitor_execution_playbook](/tools/lookup-click-and-collect-sla-monitor-execution-playbook.md)
- [action_salesforce_commerce_cloud_escalate](/tools/action-salesforce-commerce-cloud-escalate.md)
