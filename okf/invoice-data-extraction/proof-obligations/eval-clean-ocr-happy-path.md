---
type: Proof Obligation
title: "Golden eval obligation — Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable."
description: golden eval proof obligation
source_id: "eval-clean-ocr-happy-path"
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

# Golden eval obligation — Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [clean-ocr-happy-path](/tests/clean-ocr-happy-path.md)


## Mechanisms

- [query_kofax_tungsten_captured_invoices](/tools/query-kofax-tungsten-captured-invoices.md)
- [query_google_document_ai_extraction_results](/tools/query-google-document-ai-extraction-results.md)
- [query_sap_s4hana_vendor_master](/tools/query-sap-s4hana-vendor-master.md)
- [query_coupa_purchase_orders](/tools/query-coupa-purchase-orders.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [action_coupa_acknowledge_invoice](/tools/action-coupa-acknowledge-invoice.md)

## Entities that must be referenced

- captured_invoices
- ocr_extractions
- vendors
- purchase_orders

## Forbidden behaviors

- do not invent vendor IDs or PO references
- do not skip vendor master validation

# Citations

- [vendor-master-validation-rules](/documents/vendor-master-validation-rules.md)
