---
type: Query Capability
title: Fuzzy match invoice data against PO and goods receipt. Apply tolerance rules ...
description: "Fuzzy match invoice data against PO and goods receipt. Apply tolerance rules for rounding, quantity variances, and price differences. Auto-resolve common exceptions."
source_id: "three-way-matching"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Fuzzy match invoice data against PO and goods receipt. Apply tolerance rules for rounding, quantity variances, and price differences. Auto-resolve common exceptions.

## Tools used

- [query_sap_s4hana_goods_receipts](/tools/query-sap-s4hana-goods-receipts.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [action_basware_route_exception](/tools/action-basware-route-exception.md)
- [calculation_tolerance_variance](/tools/calculation-tolerance-variance.md)
- [evidence_ap_three_way_match_policy](/tools/evidence-ap-three-way-match-policy.md)
- [evidence_exception_resolution_sop](/tools/evidence-exception-resolution-sop.md)

## Runs in

- [three_way_matching](/workflow/three-way-matching.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail
- document_reference

## Evals

- [Process invoice INV-2025-0042 (vendor GE Supplier XYZ, amount USD 15,000) against PO PO-2025-1001 and goods receipt GR-2025-5003. The invoice quantity matches GR quantity and amount is within 2% of PO.](/tests/happy-path-three-way-match.md)
- [Process invoice INV-2025-0043 (vendor GE Supplier ABC, amount USD 15,500) against PO PO-2025-1002 (PO amount USD 15,000). The price variance is 3.3%, exceeding the 2% tolerance.](/tests/tolerance-exception-escalation.md)
- [Process invoice INV-2025-0044 (vendor ID unknown, amount USD 8,000) against PO PO-2025-1003. The vendor is not in Coupa supplier catalog.](/tests/vendor-not-found-escalation.md)

# Citations

- [AP Three-Way Match Policy](/documents/ap-three-way-match-policy.md)
- [Exception Resolution SOP](/documents/exception-resolution-sop.md)
