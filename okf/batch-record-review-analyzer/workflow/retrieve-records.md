---
type: Workflow Stage
title: Retrieve Records
description: Query inspection lots and nonconformance records from SAP S/4HANA QM and correlate with Siemens Opcenter MES for the Batch Record Review Analyzer workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query inspection lots and nonconformance records from SAP S/4HANA QM and correlate with Siemens Opcenter MES for the Batch Record Review Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [lookup_batch_record_review_analyzer_sop](/tools/lookup-batch-record-review-analyzer-sop.md)
- [action_sap_s_4hana_qm_recommend](/tools/action-sap-s-4hana-qm-recommend.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
