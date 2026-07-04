---
type: Data Entity
title: leads
description: Data entity leads owned by Marketo.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# leads

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | person.fullName | required |
| email | internet.email | required |
| company | company.name | required |
| score | number | required |
| stage | enum | required; values: new, qualified, engaged, opportunity, lost |
| created_at | date | required |

# Citations

- Owned by [Marketo](/systems/marketo.md)
