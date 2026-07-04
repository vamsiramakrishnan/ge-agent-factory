---
type: Proof Obligation
title: "Golden eval obligation — Run the Innovation & Value Engineering Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-innovation-value-engineering-tracker-end-to-end"
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

# Golden eval obligation — Run the Innovation & Value Engineering Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [innovation-value-engineering-tracker-end-to-end](/tests/innovation-value-engineering-tracker-end-to-end.md)


## Mechanisms

- [query_supplier_portal_supplier_portal_records](/tools/query-supplier-portal-supplier-portal-records.md)
- [query_innovation_management_innovation_management_records](/tools/query-innovation-management-innovation-management-records.md)
- [query_contract_data_contract_data_records](/tools/query-contract-data-contract-data-records.md)
- [query_engineering_change_orders_engineering_change_orders_records](/tools/query-engineering-change-orders-engineering-change-orders-records.md)
- [lookup_innovation_value_engineering_tracker_policy_guide](/tools/lookup-innovation-value-engineering-tracker-policy-guide.md)

## Entities that must be referenced

- supplier_portal_records
- innovation_management_records
- contract_data_records
- engineering_change_orders_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [innovation-value-engineering-tracker-policy-guide](/documents/innovation-value-engineering-tracker-policy-guide.md)
