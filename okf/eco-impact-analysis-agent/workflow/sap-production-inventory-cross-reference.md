---
type: Workflow Stage
title: "SAP Production & Inventory Cross-Reference"
description: "Join the where-used set against open process_orders, work_center_confirmations, and material_stagings in SAP S/4HANA PP via query_sap_s_4hana_pp_process_orders, query_sap_s_4hana_pp_work_center_confirmations, and query_sap_s_4hana_pp_material_stagings to size WIP and on-hand exposure."
source_id: sap_production_inventory_cross_reference
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SAP Production & Inventory Cross-Reference

Join the where-used set against open process_orders, work_center_confirmations, and material_stagings in SAP S/4HANA PP via query_sap_s_4hana_pp_process_orders, query_sap_s_4hana_pp_work_center_confirmations, and query_sap_s_4hana_pp_material_stagings to size WIP and on-hand exposure.

- **Mode:** sequential
- **Stage:** 3 of 6

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)

Next: [Effectivity & Stranded-Cost Scoring](/workflow/effectivity-stranded-cost-scoring.md)
