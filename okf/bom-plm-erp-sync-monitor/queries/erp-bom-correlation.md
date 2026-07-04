---
type: Query Capability
title: Match Windchill bom_revisions component structures against SAP S/4HANA PP pro...
description: "Match Windchill bom_revisions component structures against SAP S/4HANA PP process_orders, work_center_confirmations, and material_stagings by material_number and order_number to find where the ERP structure has drifted."
source_id: "erp-bom-correlation"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Match Windchill bom_revisions component structures against SAP S/4HANA PP process_orders, work_center_confirmations, and material_stagings by material_number and order_number to find where the ERP structure has drifted.

## Tools used

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [action_ptc_windchill_plm_escalate](/tools/action-ptc-windchill-plm-escalate.md)

## Runs in

- [erp_bom_correlation](/workflow/erp-bom-correlation.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the BOM PLM-ERP Sync Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bom-plm-erp-sync-monitor-end-to-end.md)
- [ECO-24187 (change_class: class_1_form_fit_function) released bom_revisions 312044-D with immediate_use_up effectivity dated 2026-06-28, superseding revision C. SAP process order 7412903 (batch 812905) is currently active on REACTOR-01, staged against bom revision C, with material staging 3041207 already at staged_qty 480 of required_qty 500 for material_number 431207. Determine whether this build should proceed and what needs to happen before it does.](/tests/bom-plm-erp-sync-monitor-effectivity-conflict.md)
- [BigQuery historical_metrics for the bom_discrepancy_count metric was last computed_at 26 hours ago, and analytics_events shows a variance_pct of 38% against that baseline. Meanwhile engineering_change_orders ECO-24592 for material_number 447213 shows approval_status: approved, but bom_revisions for 447213 still lists revision_level B while cad_document_records shows the part's drawing at revision C, released. Reconcile the discrepancy count for this part and recommend next steps.](/tests/bom-plm-erp-sync-monitor-stale-baseline-reconciliation.md)

# Citations

- [BOM PLM-ERP Sync Monitor Standard Operating Procedure](/documents/bom-plm-erp-sync-monitor-sop.md)
- [Engineering Change Control Board (CCB) Effectivity & BOM Cut-In Policy](/documents/eco-effectivity-change-control-policy.md)
