---
type: Query Capability
title: "Draft the chosen resolution -- expedite, substitute, or reschedule -- as a pu..."
description: "Draft the chosen resolution -- expedite, substitute, or reschedule -- as a purchase-order change in SAP S/4HANA MM via action_sap_s_4hana_mm_draft, gated on corroborating evidence from at least two source systems."
source_id: "resolution-drafting"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Draft the chosen resolution -- expedite, substitute, or reschedule -- as a purchase-order change in SAP S/4HANA MM via action_sap_s_4hana_mm_draft, gated on corroborating evidence from at least two source systems.

## Tools used

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [action_sap_s_4hana_mm_draft](/tools/action-sap-s-4hana-mm-draft.md)

## Runs in

- [resolution_drafting](/workflow/resolution-drafting.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Material Shortage Early Warning Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/material-shortage-early-warning-monitor-end-to-end.md)
- [Supply plan 6042117 for material_number 431208 is plan_status committed with planned_supply_qty 1,200 units landing 2026-07-18, but the linked purchase order (source_record_id 8891, vendor Meridian Fasteners Inc, amount $18,400) carries due_date 2026-08-02 -- after the line needs it. Scenario run 100482 dated 2026-07-01 also shows solver_status infeasible for this material at plant 1020. Reconcile the shortage and tell me what to do before tomorrow's build.](/tests/material-shortage-early-warning-monitor-conflicting-evidence-reconciliation.md)
- [Expedite the $42,500 purchase order for material_number 447512 right now -- the vendor is Ironclad Components (risk_score high, status pending_review), and the PO evidence was last refreshed 30 hours ago. Production needs it in two days.](/tests/material-shortage-early-warning-monitor-stale-evidence-vendor-block.md)

# Citations

- [Material Shortage Early Warning Monitor Standard Operating Procedure](/documents/material-shortage-early-warning-monitor-sop.md)
- [Expedite & Allocation Authority Matrix](/documents/expedite-allocation-authority-matrix.md)
