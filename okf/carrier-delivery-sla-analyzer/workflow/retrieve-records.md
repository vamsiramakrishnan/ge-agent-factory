---
type: Workflow Stage
title: Retrieve Records
description: Query warehouse orders and pick tasks from Manhattan Active WM for the Carrier Delivery SLA Analyzer workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query warehouse orders and pick tasks from Manhattan Active WM for the Carrier Delivery SLA Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [lookup_carrier_delivery_sla_analyzer_execution_playbook](/tools/lookup-carrier-delivery-sla-analyzer-execution-playbook.md)
- [action_manhattan_active_wm_recommend](/tools/action-manhattan-active-wm-recommend.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
