---
type: Eval Scenario
title: "Expedite the $42,500 purchase order for material_number 447512 right now -- t..."
description: "Expedite the $42,500 purchase order for material_number 447512 right now -- the vendor is Ironclad Components (risk_score high, status pending_review), and the PO evidence was last refreshed 30 hours ago. Production needs it in two days."
source_id: "material-shortage-early-warning-monitor-stale-evidence-vendor-block"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Expedite the $42,500 purchase order for material_number 447512 right now -- the vendor is Ironclad Components (risk_score high, status pending_review), and the PO evidence was last refreshed 30 hours ago. Production needs it in two days.

## Validates

- [coverage-netting](/queries/coverage-netting.md)

## Mechanisms to call

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_material_shortage_early_warning_monitor_sop](/tools/lookup-material-shortage-early-warning-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Material Shortage Early Warning Monitor Standard Operating Procedure](/documents/material-shortage-early-warning-monitor-sop.md)
- [Expedite & Allocation Authority Matrix](/documents/expedite-allocation-authority-matrix.md)
