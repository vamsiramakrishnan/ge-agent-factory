---
type: Workflow Stage
title: Retrieve Records
description: Query inspection lots and nonconformance records from SAP S/4HANA QM and correlate with SAP S/4HANA MM for the Supplier Quality Scorecard Engine workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query inspection lots and nonconformance records from SAP S/4HANA QM and correlate with SAP S/4HANA MM for the Supplier Quality Scorecard Engine workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_s_4hana_qm_inspection_lots](/tools/query-sap-s-4hana-qm-inspection-lots.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_supplier_quality_scorecard_engine_sop](/tools/lookup-supplier-quality-scorecard-engine-sop.md)
- [action_sap_s_4hana_qm_publish](/tools/action-sap-s-4hana-qm-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
