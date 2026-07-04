---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-01T00:00:00.000Z"
---

# Query Capabilities

- [Ingest invoices from email, supplier portal, or EDI. Classify format (PDF vs. scanned image vs. EDI vs. XML) and route through appropriate extraction pipeline.](/queries/invoice-ingestion-classification.md)
- [Document AI extracts header and line-item fields with per-field confidence scores. High-confidence extractions proceed to validation; low-confidence items routed to LLM interpretation.](/queries/ocr-extraction-confidence-scoring.md)
- [Interpret invoices OCR cannot reliably handle: handwritten invoices, non-standard layouts, quantities like '2 pallets @ ~500 units each, actuals per delivery note.' Resolve vendor identity when invoice says 'Acme Corp' but vendor master has 'Acme Industries LLC' — reason about whether same entity or different.](/queries/llm-interpretation-entity-resolution.md)
- [Validate extracted data against vendor master and PO. Post validated invoices to ERP or route to exception queue for manual review.](/queries/validation-posting.md)
