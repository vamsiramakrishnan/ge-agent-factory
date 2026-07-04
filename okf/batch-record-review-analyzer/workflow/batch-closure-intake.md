---
type: Workflow Stage
title: Batch Closure Intake
description: Trigger the moment a production_orders record moves to teco or confirmed in Siemens Opcenter MES (query_siemens_opcenter_mes_production_orders); pull the matching inspection_lots and quality_checks records for that material_number from SAP S/4HANA QM (query_sap_s_4hana_qm_inspection_lots).
source_id: batch_closure_intake
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Batch Closure Intake

Trigger the moment a production_orders record moves to teco or confirmed in Siemens Opcenter MES (query_siemens_opcenter_mes_production_orders); pull the matching inspection_lots and quality_checks records for that material_number from SAP S/4HANA QM (query_sap_s_4hana_qm_inspection_lots).

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [lookup_batch_record_review_analyzer_sop](/tools/lookup-batch-record-review-analyzer-sop.md)
- [action_sap_s_4hana_qm_recommend](/tools/action-sap-s-4hana-qm-recommend.md)

Next: [Spec & Control-Limit Screening](/workflow/spec-control-limit-screening.md)
