---
type: Data Entity
title: category_strategy_docs_records
description: Data entity category_strategy_docs_records owned by Category strategy docs.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# category_strategy_docs_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| status | enum | required; values: active, pending, closed |
| owner | person.fullName | required |
| created_at | date | required |
| notes | lorem.sentence |  |

# Citations

- Owned by [Category strategy docs](/systems/category-strategy-docs.md)
