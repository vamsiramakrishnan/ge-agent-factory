---
type: Workflow Stage
title: "Playbook & Routing-Guide Evidence Gate"
description: "Cross-check every at-risk warehouse_orders finding against the Inbound PO ETA Monitor Retail Execution Playbook and the Inbound Vendor Compliance & Routing Guide via lookup_inbound_po_eta_monitor_execution_playbook, citing the governing appointment-window and expedite-approval sections before any dock rebalance or freight recommendation is issued."
source_id: playbook_routing_guide_evidence_gate
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Playbook & Routing-Guide Evidence Gate

Cross-check every at-risk warehouse_orders finding against the Inbound PO ETA Monitor Retail Execution Playbook and the Inbound Vendor Compliance & Routing Guide via lookup_inbound_po_eta_monitor_execution_playbook, citing the governing appointment-window and expedite-approval sections before any dock rebalance or freight recommendation is issued.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_manhattan_active_wm_warehouse_orders](/tools/query-manhattan-active-wm-warehouse-orders.md)
- [query_oracle_retail_mfcs_item_master](/tools/query-oracle-retail-mfcs-item-master.md)
- [lookup_inbound_po_eta_monitor_execution_playbook](/tools/lookup-inbound-po-eta-monitor-execution-playbook.md)

Next: [Escalate, Expedite & Audit](/workflow/escalate-expedite-audit.md)
