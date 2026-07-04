---
type: Query Capability
title: "Document AI extracts header and line-item fields with per-field confidence sc..."
description: "Document AI extracts header and line-item fields with per-field confidence scores. High-confidence extractions proceed to validation; low-confidence items routed to LLM interpretation."
source_id: "ocr-extraction-confidence-scoring"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Document AI extracts header and line-item fields with per-field confidence scores. High-confidence extractions proceed to validation; low-confidence items routed to LLM interpretation.

## Tools used

- [query_google_document_ai_extraction_results](/tools/query-google-document-ai-extraction-results.md)
- [action_basware_route_to_exception_queue](/tools/action-basware-route-to-exception-queue.md)
- [evidence_vendor_validation_rules](/tools/evidence-vendor-validation-rules.md)

## Runs in

- [ocr_extraction_confidence_scoring](/workflow/ocr-extraction-confidence-scoring.md)

## Evidence expected

- sql_result
- source_system_record
- api_response
- generated_audit_trail
- document_reference

## Evals

- [Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.](/tests/clean-ocr-happy-path.md)
- [Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity.](/tests/handwritten-llm-fallback.md)
- [Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme Manufacturing' as separate vendors. Determine if same entity or different suppliers.](/tests/vendor-alias-resolution.md)

# Citations

- [Vendor Master Validation Rules & Alias Matching](/documents/vendor-master-validation-rules.md)
- [Invoice Exception Triage SOP](/documents/invoice-exception-triage-sop.md)
