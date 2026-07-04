---
type: Proof Obligation
title: "Golden eval obligation — Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity."
description: golden eval proof obligation
source_id: "eval-handwritten-llm-fallback"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.1
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.1
- **Eval:** [handwritten-llm-fallback](/tests/handwritten-llm-fallback.md)


## Mechanisms

- [query_kofax_tungsten_captured_invoices](/tools/query-kofax-tungsten-captured-invoices.md)
- [query_google_document_ai_extraction_results](/tools/query-google-document-ai-extraction-results.md)
- [query_sap_s4hana_vendor_master](/tools/query-sap-s4hana-vendor-master.md)

## Entities that must be referenced

- captured_invoices
- ocr_extractions
- vendors

## Forbidden behaviors

- do not post with confidence < 0.7 without LLM agreement
- do not guess vendor identity

# Citations

- [vendor-master-validation-rules](/documents/vendor-master-validation-rules.md)
