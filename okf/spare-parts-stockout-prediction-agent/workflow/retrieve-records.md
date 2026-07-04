---
type: Workflow Stage
title: Retrieve Records
description: Query maintenance work orders and asset registry entries from IBM Maximo and correlate with SAP S/4HANA MM for the Spare Parts Stockout Prediction Agent workflow.
source_id: retrieve_records
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query maintenance work orders and asset registry entries from IBM Maximo and correlate with SAP S/4HANA MM for the Spare Parts Stockout Prediction Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_spare_parts_stockout_prediction_agent_sop](/tools/lookup-spare-parts-stockout-prediction-agent-sop.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
