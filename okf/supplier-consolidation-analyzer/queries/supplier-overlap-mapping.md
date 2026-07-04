---
type: Query Capability
title: "Pull vendor master and spend data. Cross-reference with contract coverage. Bu..."
description: "Pull vendor master and spend data. Cross-reference with contract coverage. Build supplier-category-BU-geography relationship graph in BigQuery to identify where multiple suppliers serve the same need."
source_id: "supplier-overlap-mapping"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull vendor master and spend data. Cross-reference with contract coverage. Build supplier-category-BU-geography relationship graph in BigQuery to identify where multiple suppliers serve the same need.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_vendor_master_vendor_master_records](/tools/query-vendor-master-vendor-master-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [lookup_supplier_consolidation_analyzer_policy_guide](/tools/lookup-supplier-consolidation-analyzer-policy-guide.md)
- [action_vendor_master_generate](/tools/action-vendor-master-generate.md)

## Runs in

- [supplier_overlap_mapping](/workflow/supplier-overlap-mapping.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Supplier Consolidation Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-consolidation-analyzer-end-to-end.md)

# Citations

- [Supplier Consolidation Analyzer Procurement Policy Guide](/documents/supplier-consolidation-analyzer-policy-guide.md)
