---
type: Workflow Stage
title: "Non-Standard Interpretation"
description: "Gemini handles non-standard invoices: handwritten, multi-currency, partial deliveries. Interprets invoice line items that don't match PO descriptions by understanding semantic equivalence."
source_id: non_standard_interpretation
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Non-Standard Interpretation

Gemini handles non-standard invoices: handwritten, multi-currency, partial deliveries. Interprets invoice line items that don't match PO descriptions by understanding semantic equivalence.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_basware_invoices](/tools/query-basware-invoices.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [evidence_ap_three_way_match_policy](/tools/evidence-ap-three-way-match-policy.md)

Next: [Posting & Payment Queue](/workflow/posting-payment-queue.md)
