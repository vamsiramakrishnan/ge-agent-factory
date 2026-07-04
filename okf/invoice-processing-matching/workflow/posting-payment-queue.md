---
type: Workflow Stage
title: "Posting & Payment Queue"
description: Post matched and resolved invoices to SAP for payment processing. Route remaining true exceptions to AP team with context.
source_id: posting_payment_queue
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Posting & Payment Queue

Post matched and resolved invoices to SAP for payment processing. Route remaining true exceptions to AP team with context.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_sap_s4hana_purchase_orders](/tools/query-sap-s4hana-purchase-orders.md)
- [query_sap_s4hana_goods_receipts](/tools/query-sap-s4hana-goods-receipts.md)
- [query_basware_invoices](/tools/query-basware-invoices.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [action_basware_route_exception](/tools/action-basware-route-exception.md)
- [calculation_tolerance_variance](/tools/calculation-tolerance-variance.md)
- [evidence_ap_three_way_match_policy](/tools/evidence-ap-three-way-match-policy.md)
- [evidence_exception_resolution_sop](/tools/evidence-exception-resolution-sop.md)
