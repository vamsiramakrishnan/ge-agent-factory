---
type: Workflow Stage
title: ERP Data Extraction
description: "Extract requisition history and consumption data from SAP S/4HANA, Oracle ERP, and Coupa. Aggregate across BUs and plants into a unified demand history."
source_id: erp_data_extraction
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ERP Data Extraction

Extract requisition history and consumption data from SAP S/4HANA, Oracle ERP, and Coupa. Aggregate across BUs and plants into a unified demand history.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_s_4hana_mm_pp_purchase_orders](/tools/query-sap-s-4hana-mm-pp-purchase-orders.md)
- [query_oracle_erp_oracle_erp_records](/tools/query-oracle-erp-oracle-erp-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_demand_forecasting_aggregation_policy_guide](/tools/lookup-demand-forecasting-aggregation-policy-guide.md)

Next: [Time-Series Forecasting](/workflow/time-series-forecasting.md)
