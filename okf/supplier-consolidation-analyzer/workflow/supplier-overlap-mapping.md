---
type: Workflow Stage
title: Supplier Overlap Mapping
description: "Pull vendor master and spend data. Cross-reference with contract coverage. Build supplier-category-BU-geography relationship graph in BigQuery to identify where multiple suppliers serve the same need."
source_id: supplier_overlap_mapping
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Supplier Overlap Mapping

Pull vendor master and spend data. Cross-reference with contract coverage. Build supplier-category-BU-geography relationship graph in BigQuery to identify where multiple suppliers serve the same need.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_vendor_master_vendor_master_records](/tools/query-vendor-master-vendor-master-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [lookup_supplier_consolidation_analyzer_policy_guide](/tools/lookup-supplier-consolidation-analyzer-policy-guide.md)
- [action_vendor_master_generate](/tools/action-vendor-master-generate.md)

Next: [Consolidation Scenario Modeling](/workflow/consolidation-scenario-modeling.md)
