---
type: Data Entity
title: category_strategy_docs_events
description: Data entity category_strategy_docs_events owned by Category strategy docs.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# category_strategy_docs_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| category_strategy_docs_record_id | ref | required |

# Citations

- Owned by [Category strategy docs](/systems/category-strategy-docs.md)
