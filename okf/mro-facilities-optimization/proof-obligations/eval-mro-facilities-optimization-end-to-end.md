---
type: Proof Obligation
title: "Golden eval obligation — Run the MRO & Facilities Optimization workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-mro-facilities-optimization-end-to-end"
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

# Golden eval obligation — Run the MRO & Facilities Optimization workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [mro-facilities-optimization-end-to-end](/tests/mro-facilities-optimization-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_maximo_maximo_records](/tools/query-maximo-maximo-records.md)
- [query_emaint_emaint_records](/tools/query-emaint-emaint-records.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_mro_facilities_optimization_policy_guide](/tools/lookup-mro-facilities-optimization-policy-guide.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

## Entities that must be referenced

- purchase_orders
- maximo_records
- emaint_records
- requisitions
- vmi_systems_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [mro-facilities-optimization-policy-guide](/documents/mro-facilities-optimization-policy-guide.md)
