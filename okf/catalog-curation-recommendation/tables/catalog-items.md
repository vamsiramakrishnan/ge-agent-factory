---
type: Data Entity
title: catalog_items
description: Data entity catalog_items owned by Coupa catalog.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# catalog_items

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| supplier_offering_id | ref | required |

# Citations

- Owned by [Coupa catalog](/systems/coupa-catalog.md)
