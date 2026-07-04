---
type: Proof Obligation
title: "Golden eval obligation — Process invoice INV-2025-0044 (vendor ID unknown, amount USD 8,000) against PO PO-2025-1003. The vendor is not in Coupa supplier catalog."
description: golden eval proof obligation
source_id: "eval-vendor-not-found-escalation"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.2
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Process invoice INV-2025-0044 (vendor ID unknown, amount USD 8,000) against PO PO-2025-1003. The vendor is not in Coupa supplier catalog.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.2
- **Eval:** [vendor-not-found-escalation](/tests/vendor-not-found-escalation.md)


## Mechanisms

- [query_basware_invoices](/tools/query-basware-invoices.md)
- [query_sap_s4hana_purchase_orders](/tools/query-sap-s4hana-purchase-orders.md)
- [query_coupa_purchase_orders](/tools/query-coupa-purchase-orders.md)
- [evidence_ap_three_way_match_policy](/tools/evidence-ap-three-way-match-policy.md)
- [action_basware_route_exception](/tools/action-basware-route-exception.md)

## Entities that must be referenced

- invoices
- vendors
- exception_queue

## Forbidden behaviors

- do not post to MIRO with unknown vendor
- do not invent vendor master records

# Citations

- [ap-three-way-match-policy](/documents/ap-three-way-match-policy.md)
