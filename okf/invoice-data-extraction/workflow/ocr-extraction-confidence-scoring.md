---
type: Workflow Stage
title: "OCR Extraction & Confidence Scoring"
description: "Document AI extracts header and line-item fields with per-field confidence scores. High-confidence extractions proceed to validation; low-confidence items routed to LLM interpretation."
source_id: ocr_extraction_confidence_scoring
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# OCR Extraction & Confidence Scoring

Document AI extracts header and line-item fields with per-field confidence scores. High-confidence extractions proceed to validation; low-confidence items routed to LLM interpretation.

- **Mode:** sequential
- **Stage:** 2 of 4

## Tools

- [query_google_document_ai_extraction_results](/tools/query-google-document-ai-extraction-results.md)
- [action_basware_route_to_exception_queue](/tools/action-basware-route-to-exception-queue.md)
- [evidence_vendor_validation_rules](/tools/evidence-vendor-validation-rules.md)

Next: [LLM Interpretation & Entity Resolution](/workflow/llm-interpretation-entity-resolution.md)
