---
type: Workflow Stage
title: Retrieve Records
description: Query warehouse orders and pick tasks from Manhattan Active WM and correlate with Oracle Retail MFCS for the Inbound PO ETA Monitor workflow.
source_id: retrieve_records
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query warehouse orders and pick tasks from Manhattan Active WM and correlate with Oracle Retail MFCS for the Inbound PO ETA Monitor workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_inbound_po_eta_monitor_execution_playbook](/tools/lookup-inbound-po-eta-monitor-execution-playbook.md)
- [action_manhattan_active_wm_escalate](/tools/action-manhattan-active-wm-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
