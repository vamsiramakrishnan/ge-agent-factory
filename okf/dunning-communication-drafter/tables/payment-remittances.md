---
type: Data Entity
title: payment_remittances
description: Data entity payment_remittances owned by HighRadius.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# payment_remittances

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| vendor | company.name | required |
| amount | float | required |
| currency | enum | required; values: USD, EUR, GBP, JPY |
| status | enum | required; values: draft, pending, approved, paid, rejected |
| created_at | date | required |
| due_date | date | required |

# Citations

- Owned by [HighRadius](/systems/highradius.md)
