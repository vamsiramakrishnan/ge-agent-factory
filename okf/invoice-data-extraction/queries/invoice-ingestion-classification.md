---
type: Query Capability
title: "Ingest invoices from email, supplier portal, or EDI. Classify format (PDF vs...."
description: "Ingest invoices from email, supplier portal, or EDI. Classify format (PDF vs. scanned image vs. EDI vs. XML) and route through appropriate extraction pipeline."
source_id: "invoice-ingestion-classification"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest invoices from email, supplier portal, or EDI. Classify format (PDF vs. scanned image vs. EDI vs. XML) and route through appropriate extraction pipeline.

## Tools used

- [query_kofax_tungsten_captured_invoices](/tools/query-kofax-tungsten-captured-invoices.md)
- [query_basware_invoice_queue](/tools/query-basware-invoice-queue.md)
- [query_google_document_ai_extraction_results](/tools/query-google-document-ai-extraction-results.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [action_basware_route_to_exception_queue](/tools/action-basware-route-to-exception-queue.md)
- [action_coupa_acknowledge_invoice](/tools/action-coupa-acknowledge-invoice.md)

## Runs in

- [invoice_ingestion_classification](/workflow/invoice-ingestion-classification.md)

## Evidence expected

- source_system_record
- sql_result
- api_response
- generated_audit_trail

## Evals

- [Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.](/tests/clean-ocr-happy-path.md)
- [Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity.](/tests/handwritten-llm-fallback.md)

# Citations

- [Vendor Master Validation Rules & Alias Matching](/documents/vendor-master-validation-rules.md)
- [Invoice Exception Triage SOP](/documents/invoice-exception-triage-sop.md)
