---
type: Workflow Stage
title: "NC/CAPA Cross-Reference"
description: "Cross-check open nonconformance_records (severity, disposition, containment_complete) and capa_actions (status, effectiveness_verified) for the same material_number in SAP S/4HANA QM so a stale accepted usage_decision can't mask an unresolved deviation."
source_id: nc_capa_cross_reference
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# NC/CAPA Cross-Reference

Cross-check open nonconformance_records (severity, disposition, containment_complete) and capa_actions (status, effectiveness_verified) for the same material_number in SAP S/4HANA QM so a stale accepted usage_decision can't mask an unresolved deviation.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [lookup_batch_record_review_analyzer_sop](/tools/lookup-batch-record-review-analyzer-sop.md)
- [action_sap_s_4hana_qm_recommend](/tools/action-sap-s-4hana-qm-recommend.md)

Next: [Exception Scoring & Baseline Compare](/workflow/exception-scoring-baseline-compare.md)
