---
type: Data Entity
title: pages
description: Data entity pages owned by Confluence.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# pages

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| title | lorem.sentence | required |
| owner | person.fullName | required |
| status | enum | required; values: draft, review, published, archived |
| last_updated | date | required |

# Citations

- Owned by [Confluence](/systems/confluence.md)
