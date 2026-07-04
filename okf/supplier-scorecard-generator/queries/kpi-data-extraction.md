---
type: Query Capability
title: "Pull quality PPM from SAP QM, OTIF from MM, and pricing from FI. Aggregate pr..."
description: "Pull quality PPM from SAP QM, OTIF from MM, and pricing from FI. Aggregate procurement data from Coupa. Consolidate into BigQuery for unified KPI computation."
source_id: "kpi-data-extraction"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull quality PPM from SAP QM, OTIF from MM, and pricing from FI. Aggregate procurement data from Coupa. Consolidate into BigQuery for unified KPI computation.

## Tools used

- [query_sap_s_4hana_qm_mm_sap_s_4hana_qm_mm_records](/tools/query-sap-s-4hana-qm-mm-sap-s-4hana-qm-mm-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_supplier_scorecard_generator_policy_guide](/tools/lookup-supplier-scorecard-generator-policy-guide.md)
- [action_sap_s_4hana_qm_mm_generate](/tools/action-sap-s-4hana-qm-mm-generate.md)

## Runs in

- [kpi_data_extraction](/workflow/kpi-data-extraction.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Supplier Scorecard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-scorecard-generator-end-to-end.md)

# Citations

- [Supplier Scorecard Generator Procurement Policy Guide](/documents/supplier-scorecard-generator-policy-guide.md)
