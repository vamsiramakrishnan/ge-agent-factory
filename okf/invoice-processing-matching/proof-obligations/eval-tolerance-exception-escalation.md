---
type: Proof Obligation
title: "Golden eval obligation — Process invoice INV-2025-0043 (vendor GE Supplier ABC, amount USD 15,500) against PO PO-2025-1002 (PO amount USD 15,000). The price variance is 3.3%, exceeding the 2% tolerance."
description: golden eval proof obligation
source_id: "eval-tolerance-exception-escalation"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.1
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Process invoice INV-2025-0043 (vendor GE Supplier ABC, amount USD 15,500) against PO PO-2025-1002 (PO amount USD 15,000). The price variance is 3.3%, exceeding the 2% tolerance.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.1
- **Eval:** [tolerance-exception-escalation](/tests/tolerance-exception-escalation.md)


## Mechanisms

- [query_basware_invoices](/tools/query-basware-invoices.md)
- [query_sap_s4hana_purchase_orders](/tools/query-sap-s4hana-purchase-orders.md)
- [query_coupa_purchase_orders](/tools/query-coupa-purchase-orders.md)
- [calculation_tolerance_variance](/tools/calculation-tolerance-variance.md)
- [evidence_ap_three_way_match_policy](/tools/evidence-ap-three-way-match-policy.md)
- [action_basware_route_exception](/tools/action-basware-route-exception.md)

## Entities that must be referenced

- invoices
- purchase_orders
- vendors
- exception_queue

## Forbidden behaviors

- do not post to MIRO when variance exceeds tolerance
- do not override tolerance threshold without AP review

# Citations

- [ap-three-way-match-policy](/documents/ap-three-way-match-policy.md)
