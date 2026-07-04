---
type: Workflow Stage
title: "BOPIS/Curbside Order Intake & SLA Clock Start"
description: "Pull online_orders from Salesforce Commerce Cloud filtered to fulfillment_method of bopis or curbside and start the 2-hour SLA clock off order_date, using query_salesforce_commerce_cloud_online_orders."
source_id: bopis_curbside_order_intake_sla_clock_start
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# BOPIS/Curbside Order Intake & SLA Clock Start

Pull online_orders from Salesforce Commerce Cloud filtered to fulfillment_method of bopis or curbside and start the 2-hour SLA clock off order_date, using query_salesforce_commerce_cloud_online_orders.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [action_salesforce_commerce_cloud_escalate](/tools/action-salesforce-commerce-cloud-escalate.md)

Next: [Pick-Task Telemetry Correlation](/workflow/pick-task-telemetry-correlation.md)
