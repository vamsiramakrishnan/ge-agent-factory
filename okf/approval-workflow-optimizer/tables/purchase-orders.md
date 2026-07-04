---
type: Data Entity
title: purchase_orders
description: Data entity purchase_orders owned by Coupa/Ariba Workflow.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# purchase_orders

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

- Owned by [Coupa/Ariba Workflow](/systems/coupa-ariba-workflow.md)
