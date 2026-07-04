---
type: Workflow Stage
title: "Carrier Scan & Order Intake"
description: "Pull warehouse_orders and pick_tasks from Manhattan Active WM to establish ship-date commitments, cut codes, and pick-completion timestamps as the delivery evidence base for every carrier under review."
source_id: carrier_scan_order_intake
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Carrier Scan & Order Intake

Pull warehouse_orders and pick_tasks from Manhattan Active WM to establish ship-date commitments, cut codes, and pick-completion timestamps as the delivery evidence base for every carrier under review.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [lookup_carrier_delivery_sla_analyzer_execution_playbook](/tools/lookup-carrier-delivery-sla-analyzer-execution-playbook.md)
- [action_manhattan_active_wm_recommend](/tools/action-manhattan-active-wm-recommend.md)

Next: [Rate & Baseline Reconciliation](/workflow/rate-baseline-reconciliation.md)
