---
type: Data Entity
title: presentations
description: Data entity presentations owned by Google Slides.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# presentations

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| title | lorem.sentence | required |
| owner | person.fullName | required |
| status | enum | required; values: draft, review, published, archived |
| last_updated | date | required |

# Citations

- Owned by [Google Slides](/systems/google-slides.md)
