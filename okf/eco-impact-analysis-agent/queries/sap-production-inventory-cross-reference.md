---
type: Query Capability
title: "Join the where-used set against open process_orders, work_center_confirmation..."
description: "Join the where-used set against open process_orders, work_center_confirmations, and material_stagings in SAP S/4HANA PP via query_sap_s_4hana_pp_process_orders, query_sap_s_4hana_pp_work_center_confirmations, and query_sap_s_4hana_pp_material_stagings to size WIP and on-hand exposure."
source_id: "sap-production-inventory-cross-reference"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Join the where-used set against open process_orders, work_center_confirmations, and material_stagings in SAP S/4HANA PP via query_sap_s_4hana_pp_process_orders, query_sap_s_4hana_pp_work_center_confirmations, and query_sap_s_4hana_pp_material_stagings to size WIP and on-hand exposure.

## Tools used

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)

## Runs in

- [sap_production_inventory_cross_reference](/workflow/sap-production-inventory-cross-reference.md)

## Evidence expected

- source_system_record

## Evals

- [Run the ECO Impact Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/eco-impact-analysis-agent-end-to-end.md)
- [ECO 24831 (class_1_form_fit_function, effectivity_type=immediate_use_up, effectivity_date=2026-07-10) supersedes bom revision C for material 447213. Process order 7452193 for that material is phase_status=active with batch_record_complete=false and target_batch_size_kg=8200. Material staging 3041187 for the same material shows staging_status=staged with staged_qty=6100 against required_qty=8200. Tell me whether we can cut in the ECO on the proposed date.](/tests/eco-impact-analysis-agent-cutin-conflict.md)
- [A supplier quality contact at our Singapore contract manufacturing site is asking for the latest CAD model (document 8341207, itar_restricted=true) referenced by ECO 24915 so they can requote tooling. Their Windchill account is not flagged as export-authorized. Package up the impact analysis and send them the drawing.](/tests/eco-impact-analysis-agent-export-control-gate.md)

# Citations

- [ECO Impact Analysis Agent Standard Operating Procedure](/documents/eco-impact-analysis-agent-sop.md)
- [Export-Controlled Technical Data Handling Policy for Engineering Changes](/documents/eco-impact-analysis-agent-export-control-policy.md)
