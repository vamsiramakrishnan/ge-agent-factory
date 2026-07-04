---
type: Eval Scenario
title: "ECO-24187 (change_class: class_1_form_fit_function) released bom_revisions 31..."
description: "ECO-24187 (change_class: class_1_form_fit_function) released bom_revisions 312044-D with immediate_use_up effectivity dated 2026-06-28, superseding revision C. SAP process order 7412903 (batch 812905) is currently active on REACTOR-01, staged against bom revision C, with material staging 3041207 already at staged_qty 480 of required_qty 500 for material_number 431207. Determine whether this build should proceed and what needs to happen before it does."
source_id: "bom-plm-erp-sync-monitor-effectivity-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ECO-24187 (change_class: class_1_form_fit_function) released bom_revisions 312044-D with immediate_use_up effectivity dated 2026-06-28, superseding revision C. SAP process order 7412903 (batch 812905) is currently active on REACTOR-01, staged against bom revision C, with material staging 3041207 already at staged_qty 480 of required_qty 500 for material_number 431207. Determine whether this build should proceed and what needs to happen before it does.

## Validates

- [nightly-eco-bom-extract](/queries/nightly-eco-bom-extract.md)

## Mechanisms to call

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_ptc_windchill_plm_bom_revisions](/tools/query-ptc-windchill-plm-bom-revisions.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_sap_s_4hana_pp_material_stagings](/tools/query-sap-s-4hana-pp-material-stagings.md)
- [lookup_bom_plm_erp_sync_monitor_sop](/tools/lookup-bom-plm-erp-sync-monitor-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [BOM PLM-ERP Sync Monitor Standard Operating Procedure](/documents/bom-plm-erp-sync-monitor-sop.md)
- [Engineering Change Control Board (CCB) Effectivity & BOM Cut-In Policy](/documents/eco-effectivity-change-control-policy.md)
