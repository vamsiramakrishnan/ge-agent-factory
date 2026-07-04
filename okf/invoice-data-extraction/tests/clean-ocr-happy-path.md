---
type: Eval Scenario
title: "Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-2..."
description: "Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable."
source_id: "clean-ocr-happy-path"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.

## Validates

- [invoice-ingestion-classification](/queries/invoice-ingestion-classification.md)

## Mechanisms to call

- [query_kofax_tungsten_captured_invoices](/tools/query-kofax-tungsten-captured-invoices.md)
- [query_google_document_ai_extraction_results](/tools/query-google-document-ai-extraction-results.md)
- [query_sap_s4hana_vendor_master](/tools/query-sap-s4hana-vendor-master.md)
- [query_coupa_purchase_orders](/tools/query-coupa-purchase-orders.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [action_coupa_acknowledge_invoice](/tools/action-coupa-acknowledge-invoice.md)

## Success rubric

Invoice posted to SAP S/4HANA with sap_invoice_id, Coupa acknowledged, all field confidence > 0.85.

# Citations

- [Vendor Master Validation Rules & Alias Matching](/documents/vendor-master-validation-rules.md)
