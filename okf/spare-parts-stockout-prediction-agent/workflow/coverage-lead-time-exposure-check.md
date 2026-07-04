---
type: Workflow Stage
title: "Coverage & Lead-Time Exposure Check"
description: "Cross-reference on-hand and on-order quantities in SAP S/4HANA MM purchase_orders against vendor lead times in vendors records (query_sap_s_4hana_mm_purchase_orders) to identify SKUs whose coverage window has closed."
source_id: coverage_lead_time_exposure_check
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Coverage & Lead-Time Exposure Check

Cross-reference on-hand and on-order quantities in SAP S/4HANA MM purchase_orders against vendor lead times in vendors records (query_sap_s_4hana_mm_purchase_orders) to identify SKUs whose coverage window has closed.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)

Next: [Stockout Risk Scoring](/workflow/stockout-risk-scoring.md)
