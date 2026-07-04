---
type: Proof Obligation
title: "Golden eval obligation — Process invoice INV-2025-0042 (vendor GE Supplier XYZ, amount USD 15,000) against PO PO-2025-1001 and goods receipt GR-2025-5003. The invoice quantity matches GR quantity and amount is within 2% of PO."
description: golden eval proof obligation
source_id: "eval-happy-path-three-way-match"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Process invoice INV-2025-0042 (vendor GE Supplier XYZ, amount USD 15,000) against PO PO-2025-1001 and goods receipt GR-2025-5003. The invoice quantity matches GR quantity and amount is within 2% of PO.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [happy-path-three-way-match](/tests/happy-path-three-way-match.md)


## Mechanisms

- [query_basware_invoices](/tools/query-basware-invoices.md)
- [query_sap_s4hana_purchase_orders](/tools/query-sap-s4hana-purchase-orders.md)
- [query_sap_s4hana_goods_receipts](/tools/query-sap-s4hana-goods-receipts.md)
- [query_coupa_purchase_orders](/tools/query-coupa-purchase-orders.md)
- [calculation_tolerance_variance](/tools/calculation-tolerance-variance.md)
- [evidence_ap_three_way_match_policy](/tools/evidence-ap-three-way-match-policy.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)

## Entities that must be referenced

- invoices
- purchase_orders
- goods_receipts
- vendors
- payment_records

## Forbidden behaviors

- do not invent MIRO document number or payment_queue_id
- do not bypass tolerance check
- do not post without all three records (invoice, PO, GR)

# Citations

- [ap-three-way-match-policy](/documents/ap-three-way-match-policy.md)
