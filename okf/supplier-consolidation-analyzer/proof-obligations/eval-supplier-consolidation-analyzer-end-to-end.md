---
type: Proof Obligation
title: "Golden eval obligation — Run the Supplier Consolidation Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-supplier-consolidation-analyzer-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Supplier Consolidation Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [supplier-consolidation-analyzer-end-to-end](/tests/supplier-consolidation-analyzer-end-to-end.md)


## Mechanisms

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_vendor_master_vendor_master_records](/tools/query-vendor-master-vendor-master-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [lookup_supplier_consolidation_analyzer_policy_guide](/tools/lookup-supplier-consolidation-analyzer-policy-guide.md)
- [action_vendor_master_generate](/tools/action-vendor-master-generate.md)

## Entities that must be referenced

- analytics_events
- vendor_master_records
- contract_data_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [supplier-consolidation-analyzer-policy-guide](/documents/supplier-consolidation-analyzer-policy-guide.md)
