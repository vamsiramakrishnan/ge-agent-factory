---
type: Workflow Stage
title: "Stock Transport Order Execution & Receipt Tracking"
description: "Draft and execute the stock transport order in SAP S/4HANA MM (action_sap_s_4hana_mm_recommend) with the full audit trail, then track the transfer through material_movements postings to receipt and notify the Inventory Analyst of the outcome."
source_id: stock_transport_order_execution_receipt_tracking
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Stock Transport Order Execution & Receipt Tracking

Draft and execute the stock transport order in SAP S/4HANA MM (action_sap_s_4hana_mm_recommend) with the full audit trail, then track the transfer through material_movements postings to receipt and notify the Inventory Analyst of the outcome.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_inventory_rebalancing_orchestrator_sop](/tools/lookup-inventory-rebalancing-orchestrator-sop.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)
