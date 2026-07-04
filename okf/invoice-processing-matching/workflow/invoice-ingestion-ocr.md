---
type: Workflow Stage
title: "Invoice Ingestion & OCR"
description: "Receive invoices via email, portal, or EDI. Extract header and line-item data using Document AI with confidence scoring on each field."
source_id: invoice_ingestion_ocr
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Invoice Ingestion & OCR

Receive invoices via email, portal, or EDI. Extract header and line-item data using Document AI with confidence scoring on each field.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_basware_invoices](/tools/query-basware-invoices.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)

Next: [Three-Way Matching](/workflow/three-way-matching.md)
