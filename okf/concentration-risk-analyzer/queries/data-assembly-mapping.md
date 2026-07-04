---
type: Query Capability
title: "Pull spend data, supplier master, and contract data across all categories and..."
description: "Pull spend data, supplier master, and contract data across all categories and geographies. Map supplier-category-geography-BU relationships for concentration analysis."
source_id: "data-assembly-mapping"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull spend data, supplier master, and contract data across all categories and geographies. Map supplier-category-geography-BU relationships for concentration analysis.

## Tools used

- [query_spend_data_spend_data_records](/tools/query-spend-data-spend-data-records.md)
- [query_supplier_master_supplier_master_records](/tools/query-supplier-master-supplier-master-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [lookup_concentration_risk_analyzer_policy_guide](/tools/lookup-concentration-risk-analyzer-policy-guide.md)
- [action_spend_data_recommend](/tools/action-spend-data-recommend.md)

## Runs in

- [data_assembly_mapping](/workflow/data-assembly-mapping.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Concentration Risk Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/concentration-risk-analyzer-end-to-end.md)

# Citations

- [Concentration Risk Analyzer Procurement Policy Guide](/documents/concentration-risk-analyzer-policy-guide.md)
