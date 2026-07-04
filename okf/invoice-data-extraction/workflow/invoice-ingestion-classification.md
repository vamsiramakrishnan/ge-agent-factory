---
type: Workflow Stage
title: "Invoice Ingestion & Classification"
description: "Ingest invoices from email, supplier portal, or EDI. Classify format (PDF vs. scanned image vs. EDI vs. XML) and route through appropriate extraction pipeline."
source_id: invoice_ingestion_classification
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Invoice Ingestion & Classification

Ingest invoices from email, supplier portal, or EDI. Classify format (PDF vs. scanned image vs. EDI vs. XML) and route through appropriate extraction pipeline.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_kofax_tungsten_captured_invoices](/tools/query-kofax-tungsten-captured-invoices.md)
- [query_basware_invoice_queue](/tools/query-basware-invoice-queue.md)
- [query_google_document_ai_extraction_results](/tools/query-google-document-ai-extraction-results.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [action_basware_route_to_exception_queue](/tools/action-basware-route-to-exception-queue.md)
- [action_coupa_acknowledge_invoice](/tools/action-coupa-acknowledge-invoice.md)

Next: [OCR Extraction & Confidence Scoring](/workflow/ocr-extraction-confidence-scoring.md)
