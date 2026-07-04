---
type: Workflow Stage
title: "Pick-Task Telemetry Correlation"
description: "Correlate each order against its Manhattan Active WM pick_tasks record -- pick_status, cases_per_hour, wave_id, and pick_zone -- via query_manhattan_active_wm_pick_tasks and query_manhattan_active_wm_warehouse_orders to see where the pick actually stands."
source_id: pick_task_telemetry_correlation
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Pick-Task Telemetry Correlation

Correlate each order against its Manhattan Active WM pick_tasks record -- pick_status, cases_per_hour, wave_id, and pick_zone -- via query_manhattan_active_wm_pick_tasks and query_manhattan_active_wm_warehouse_orders to see where the pick actually stands.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)

Next: [Breach Risk Scoring Against Historical Baselines](/workflow/breach-risk-scoring-against-historical-baselines.md)
