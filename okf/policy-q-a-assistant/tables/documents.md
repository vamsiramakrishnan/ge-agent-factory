---
type: Data Entity
title: documents
description: Data entity documents owned by SharePoint.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# documents

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| title | lorem.sentence | required |
| owner | person.fullName | required |
| status | enum | required; values: draft, review, published, archived |
| last_updated | date | required |

# Citations

- Owned by [SharePoint](/systems/sharepoint.md)
