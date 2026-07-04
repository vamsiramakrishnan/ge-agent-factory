---
type: Data Entity
title: exception_queue
description: Data entity exception_queue owned by Basware.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# exception_queue

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| captured_invoice_id | ref | required |
| reason | enum | required; values: low_confidence_extraction, vendor_not_found, ambiguous_quantity, duplicate_candidate, ocr_llm_disagreement |
| assigned_to | text | required |

# Citations

- Owned by [Basware](/systems/basware.md)
