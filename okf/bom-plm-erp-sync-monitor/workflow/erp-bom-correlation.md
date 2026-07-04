---
type: Workflow Stage
title: ERP BOM correlation
description: "Match Windchill bom_revisions component structures against SAP S/4HANA PP process_orders, work_center_confirmations, and material_stagings by material_number and order_number to find where the ERP structure has drifted."
source_id: erp_bom_correlation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ERP BOM correlation

Match Windchill bom_revisions component structures against SAP S/4HANA PP process_orders, work_center_confirmations, and material_stagings by material_number and order_number to find where the ERP structure has drifted.

- **Mode:** sequential
- **Stage:** 2 of 6

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

Next: [Root-cause classification](/workflow/root-cause-classification.md)
