---
type: Workflow Stage
title: "Inbound PO & Wave Ingestion"
description: "Pull open warehouse_orders (order_number, dc_number, ship_date, fill_rate_pct, cut_code) from Manhattan Active WM via query_manhattan_active_wm_warehouse_orders and correlate against Oracle Retail MFCS item_master (case_pack, item_status) via query_oracle_retail_mfcs_item_master to establish which inbound POs and DC waves are currently in flight."
source_id: inbound_po_wave_ingestion
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Inbound PO & Wave Ingestion

Pull open warehouse_orders (order_number, dc_number, ship_date, fill_rate_pct, cut_code) from Manhattan Active WM via query_manhattan_active_wm_warehouse_orders and correlate against Oracle Retail MFCS item_master (case_pack, item_status) via query_oracle_retail_mfcs_item_master to establish which inbound POs and DC waves are currently in flight.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_inbound_po_eta_monitor_execution_playbook](/tools/lookup-inbound-po-eta-monitor-execution-playbook.md)
- [action_manhattan_active_wm_escalate](/tools/action-manhattan-active-wm-escalate.md)

Next: [ETA Slippage & Cut-Code Scoring](/workflow/eta-slippage-cut-code-scoring.md)
