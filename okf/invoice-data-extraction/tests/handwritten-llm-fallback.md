---
type: Eval Scenario
title: "Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Ac..."
description: "Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity."
source_id: "handwritten-llm-fallback"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity.

## Validates

- [invoice-ingestion-classification](/queries/invoice-ingestion-classification.md)

## Mechanisms to call

- [query_kofax_tungsten_captured_invoices](/tools/query-kofax-tungsten-captured-invoices.md)
- [query_google_document_ai_extraction_results](/tools/query-google-document-ai-extraction-results.md)
- [query_sap_s4hana_vendor_master](/tools/query-sap-s4hana-vendor-master.md)

## Success rubric

Escalate to AP Manager due to ambiguous quantity ('approx'); do not attempt LLM interpretation without explicit corroboration.

# Citations

- [Vendor Master Validation Rules & Alias Matching](/documents/vendor-master-validation-rules.md)
