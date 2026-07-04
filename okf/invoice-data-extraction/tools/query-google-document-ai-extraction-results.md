---
type: Agent Tool
title: query_google_document_ai_extraction_results
description: "Retrieve OCR extraction results with per-field confidence scores for vendor, amount, date, PO#, and line items."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_google_document_ai_extraction_results

Retrieve OCR extraction results with per-field confidence scores for vendor, amount, date, PO#, and line items.

- **Kind:** query
- **Source system:** [Google Document AI](/systems/google-document-ai.md)

## Inputs

- invoice_id

## Outputs

- extracted_fields
- confidence_scores

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Document AI](/systems/google-document-ai.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [invoice_ingestion_classification](/workflow/invoice-ingestion-classification.md)
- [ocr_extraction_confidence_scoring](/workflow/ocr-extraction-confidence-scoring.md)

## Evals

- [Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.](/tests/clean-ocr-happy-path.md)
- [Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity.](/tests/handwritten-llm-fallback.md)

## Evidence emitted

- sql_result
- source_system_record

## Required inputs

- invoice_id

## Produces

- extracted_fields
- confidence_scores

# Examples

```
query_google_document_ai_extraction_results(invoice_id=<invoice_id>)
```

# Citations

- [Google Document AI](/systems/google-document-ai.md)
