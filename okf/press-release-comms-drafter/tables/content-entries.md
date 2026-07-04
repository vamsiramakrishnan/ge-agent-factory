---
type: Data Entity
title: content_entries
description: Data entity content_entries owned by WordPress.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# content_entries

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

- Owned by [WordPress](/systems/wordpress.md)
