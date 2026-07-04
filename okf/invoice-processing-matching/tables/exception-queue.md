---
type: Data Entity
title: exception_queue
description: Data entity exception_queue owned by Basware.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# exception_queue

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| invoice_id | ref | required |
| exception_type | enum | required; values: amount_variance, vendor_not_found, po_not_found, quantity_mismatch, payment_block |
| context_summary | lorem.sentence | required |
| status | enum | required; values: open, in_review, resolved, escalated |

# Citations

- Owned by [Basware](/systems/basware.md)
