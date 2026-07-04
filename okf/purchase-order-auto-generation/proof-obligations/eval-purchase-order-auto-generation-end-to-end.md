---
type: Proof Obligation
title: "Golden eval obligation — Run the Purchase Order Auto-Generation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-purchase-order-auto-generation-end-to-end"
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

# Golden eval obligation — Run the Purchase Order Auto-Generation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [purchase-order-auto-generation-end-to-end](/tests/purchase-order-auto-generation-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_mm_me21n_purchase_orders](/tools/query-sap-s-4hana-mm-me21n-purchase-orders.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [query_ariba_ariba_records](/tools/query-ariba-ariba-records.md)
- [lookup_purchase_order_auto_generation_policy_guide](/tools/lookup-purchase-order-auto-generation-policy-guide.md)
- [action_sap_s_4hana_mm_me21n_match](/tools/action-sap-s-4hana-mm-me21n-match.md)

## Entities that must be referenced

- purchase_orders
- requisitions
- ariba_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute match without two-system evidence

# Citations

- [purchase-order-auto-generation-policy-guide](/documents/purchase-order-auto-generation-policy-guide.md)
