---
type: Eval Scenario
title: "Process invoice INV-2025-0042 (vendor GE Supplier XYZ, amount USD 15,000) aga..."
description: "Process invoice INV-2025-0042 (vendor GE Supplier XYZ, amount USD 15,000) against PO PO-2025-1001 and goods receipt GR-2025-5003. The invoice quantity matches GR quantity and amount is within 2% of PO."
source_id: "happy-path-three-way-match"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Process invoice INV-2025-0042 (vendor GE Supplier XYZ, amount USD 15,000) against PO PO-2025-1001 and goods receipt GR-2025-5003. The invoice quantity matches GR quantity and amount is within 2% of PO.

## Validates

- [posting-payment-queue](/queries/posting-payment-queue.md)

## Mechanisms to call

- [query_basware_invoices](/tools/query-basware-invoices.md)
- [query_sap_s4hana_purchase_orders](/tools/query-sap-s4hana-purchase-orders.md)
- [query_sap_s4hana_goods_receipts](/tools/query-sap-s4hana-goods-receipts.md)
- [query_coupa_purchase_orders](/tools/query-coupa-purchase-orders.md)
- [calculation_tolerance_variance](/tools/calculation-tolerance-variance.md)
- [evidence_ap_three_way_match_policy](/tools/evidence-ap-three-way-match-policy.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)

## Success rubric

Invoice posted to SAP MIRO with payment_queue_id and audit trail; confirmation emitted to AP Manager.

# Citations

- [AP Three-Way Match Policy](/documents/ap-three-way-match-policy.md)
