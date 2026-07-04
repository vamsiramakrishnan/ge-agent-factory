---
type: Data Entity
title: requisitions
description: Data entity requisitions owned by Coupa Sourcing.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# requisitions

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

- Owned by [Coupa Sourcing](/systems/coupa-sourcing.md)
