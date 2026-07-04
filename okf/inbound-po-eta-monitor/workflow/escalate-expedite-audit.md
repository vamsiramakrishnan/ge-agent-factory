---
type: Workflow Stage
title: "Escalate, Expedite & Audit"
description: "Execute action_manhattan_active_wm_escalate against Manhattan Active WM for confirmed at-risk warehouse_orders, generating an audit_record_id and routing exceptions feeding promotions or ad items to the Inventory Control Analyst, replenishment_manager, or dc_operations_lead per the escalation rules."
source_id: escalate_expedite_audit
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Escalate, Expedite & Audit

Execute action_manhattan_active_wm_escalate against Manhattan Active WM for confirmed at-risk warehouse_orders, generating an audit_record_id and routing exceptions feeding promotions or ad items to the Inventory Control Analyst, replenishment_manager, or dc_operations_lead per the escalation rules.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [action_manhattan_active_wm_escalate](/tools/action-manhattan-active-wm-escalate.md)
