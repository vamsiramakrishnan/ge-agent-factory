---
type: Data Entity
title: gl_entries
description: Data entity gl_entries owned by SAP S/4HANA FI/MM.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# gl_entries

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| posting_date | date | required |
| account | enum | required; values: 1000-Cash, 2000-AP, 2100-AR, 3000-Revenue, 4000-Expense, 5000-COGS |
| amount | float | required |
| currency | enum | required; values: USD, EUR, GBP |
| description | lorem.sentence | required |
| status | enum | required; values: posted, pending, reversed |

# Citations

- Owned by [SAP S/4HANA FI/MM](/systems/sap-s-4hana-fi-mm.md)
