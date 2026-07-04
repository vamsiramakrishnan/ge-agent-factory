---
type: Workflow Stage
title: "Three-Way Matching"
description: "Fuzzy match invoice data against PO and goods receipt. Apply tolerance rules for rounding, quantity variances, and price differences. Auto-resolve common exceptions."
source_id: three_way_matching
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Three-Way Matching

Fuzzy match invoice data against PO and goods receipt. Apply tolerance rules for rounding, quantity variances, and price differences. Auto-resolve common exceptions.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_sap_s4hana_goods_receipts](/tools/query-sap-s4hana-goods-receipts.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [action_basware_route_exception](/tools/action-basware-route-exception.md)
- [calculation_tolerance_variance](/tools/calculation-tolerance-variance.md)
- [evidence_ap_three_way_match_policy](/tools/evidence-ap-three-way-match-policy.md)
- [evidence_exception_resolution_sop](/tools/evidence-exception-resolution-sop.md)

Next: [Non-Standard Interpretation](/workflow/non-standard-interpretation.md)
