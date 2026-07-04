---
type: Proof Obligation
title: "Golden eval obligation — Run the Requisition Intake & Smart Routing workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-requisition-intake-smart-routing-end-to-end"
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

# Golden eval obligation — Run the Requisition Intake & Smart Routing workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [requisition-intake-smart-routing-end-to-end](/tests/requisition-intake-smart-routing-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_mm_me51n_purchase_orders](/tools/query-sap-s-4hana-mm-me51n-purchase-orders.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_oracle_oracle_records](/tools/query-oracle-oracle-records.md)
- [lookup_requisition_intake_smart_routing_policy_guide](/tools/lookup-requisition-intake-smart-routing-policy-guide.md)
- [action_sap_s_4hana_mm_me51n_match](/tools/action-sap-s-4hana-mm-me51n-match.md)

## Entities that must be referenced

- purchase_orders
- requisitions
- oracle_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute match without two-system evidence

# Citations

- [requisition-intake-smart-routing-policy-guide](/documents/requisition-intake-smart-routing-policy-guide.md)
