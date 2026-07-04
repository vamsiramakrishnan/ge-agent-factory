---
type: Data Entity
title: ocr_extractions
description: Data entity ocr_extractions owned by Google Document AI.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ocr_extractions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| captured_invoice_id | ref | required |
| field_name | enum | required; values: vendor_name, invoice_amount, invoice_date, po_number, line_item_description |
| value | text | required |
| confidence | number | required |

# Citations

- Owned by [Google Document AI](/systems/google-document-ai.md)
