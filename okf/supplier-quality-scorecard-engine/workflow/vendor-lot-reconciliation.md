---
type: Workflow Stage
title: Vendor Lot Reconciliation
description: Pull inspection_lots and nonconformance_records from SAP S/4HANA QM via query_sap_s_4hana_qm_inspection_lots and match each lot to its purchase_orders and vendors record from SAP S/4HANA MM via query_sap_s_4hana_mm_purchase_orders so every rejection traces to a named supplier.
source_id: vendor_lot_reconciliation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Vendor Lot Reconciliation

Pull inspection_lots and nonconformance_records from SAP S/4HANA QM via query_sap_s_4hana_qm_inspection_lots and match each lot to its purchase_orders and vendors record from SAP S/4HANA MM via query_sap_s_4hana_mm_purchase_orders so every rejection traces to a named supplier.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_supplier_quality_scorecard_engine_sop](/tools/lookup-supplier-quality-scorecard-engine-sop.md)
- [action_sap_s_4hana_qm_publish](/tools/action-sap-s-4hana-qm-publish.md)

Next: [PPM & CAPA Trend Compute](/workflow/ppm-capa-trend-compute.md)
