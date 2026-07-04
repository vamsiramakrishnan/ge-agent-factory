---
type: Workflow Stage
title: Retrieve Records
description: Query supply plans and demand signals from Kinaxis RapidResponse and correlate with SAP S/4HANA MM for the Supplier Delivery Risk Analyzer workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query supply plans and demand signals from Kinaxis RapidResponse and correlate with SAP S/4HANA MM for the Supplier Delivery Risk Analyzer workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_supplier_delivery_risk_analyzer_sop](/tools/lookup-supplier-delivery-risk-analyzer-sop.md)
- [action_sap_s_4hana_mm_publish](/tools/action-sap-s-4hana-mm-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
