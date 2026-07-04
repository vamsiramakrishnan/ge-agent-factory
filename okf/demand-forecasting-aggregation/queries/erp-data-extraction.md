---
type: Query Capability
title: "Extract requisition history and consumption data from SAP S/4HANA, Oracle ERP..."
description: "Extract requisition history and consumption data from SAP S/4HANA, Oracle ERP, and Coupa. Aggregate across BUs and plants into a unified demand history."
source_id: "erp-data-extraction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract requisition history and consumption data from SAP S/4HANA, Oracle ERP, and Coupa. Aggregate across BUs and plants into a unified demand history.

## Tools used

- [query_sap_s_4hana_mm_pp_purchase_orders](/tools/query-sap-s-4hana-mm-pp-purchase-orders.md)
- [query_oracle_erp_oracle_erp_records](/tools/query-oracle-erp-oracle-erp-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_demand_forecasting_aggregation_policy_guide](/tools/lookup-demand-forecasting-aggregation-policy-guide.md)

## Runs in

- [erp_data_extraction](/workflow/erp-data-extraction.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Demand Forecasting & Aggregation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/demand-forecasting-aggregation-end-to-end.md)

# Citations

- [Demand Forecasting & Aggregation Procurement Policy Guide](/documents/demand-forecasting-aggregation-policy-guide.md)
