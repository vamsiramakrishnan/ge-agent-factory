---
type: Proof Obligation
title: "Golden eval obligation — Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-three-way-match-exception-handler-end-to-end"
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

# Golden eval obligation — Run the Three-Way Match Exception Handler workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [three-way-match-exception-handler-end-to-end](/tests/three-way-match-exception-handler-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_miro_mir7_sap_s_4hana_miro_mir7_records](/tools/query-sap-s-4hana-miro-mir7-sap-s-4hana-miro-mir7-records.md)
- [query_coupa_pay_requisitions](/tools/query-coupa-pay-requisitions.md)
- [query_basware_basware_records](/tools/query-basware-basware-records.md)
- [query_kofax_kofax_records](/tools/query-kofax-kofax-records.md)
- [lookup_three_way_match_exception_handler_policy_guide](/tools/lookup-three-way-match-exception-handler-policy-guide.md)
- [action_sap_s_4hana_miro_mir7_recommend](/tools/action-sap-s-4hana-miro-mir7-recommend.md)

## Entities that must be referenced

- sap_s_4hana_miro_mir7_records
- requisitions
- basware_records
- kofax_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [three-way-match-exception-handler-policy-guide](/documents/three-way-match-exception-handler-policy-guide.md)
