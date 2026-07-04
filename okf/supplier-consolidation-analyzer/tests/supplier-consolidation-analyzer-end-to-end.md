---
type: Eval Scenario
title: Run the Supplier Consolidation Analyzer workflow for the current period. Cite...
description: "Run the Supplier Consolidation Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "supplier-consolidation-analyzer-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Supplier Consolidation Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [supplier-overlap-mapping](/queries/supplier-overlap-mapping.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_vendor_master_vendor_master_records](/tools/query-vendor-master-vendor-master-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [lookup_supplier_consolidation_analyzer_policy_guide](/tools/lookup-supplier-consolidation-analyzer-policy-guide.md)
- [action_vendor_master_generate](/tools/action-vendor-master-generate.md)

## Success rubric

Action generate executed against Vendor Master, with audit-trail entry and Category Manager notified of outcomes.

# Citations

- [Supplier Consolidation Analyzer Procurement Policy Guide](/documents/supplier-consolidation-analyzer-policy-guide.md)
