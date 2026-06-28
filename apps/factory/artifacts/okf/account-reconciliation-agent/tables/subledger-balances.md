---
type: Data Entity
title: subledger_balances
description: Data entity subledger_balances owned by SAP S/4HANA FI.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-06-20T00:25:58.081Z"
---

# subledger_balances

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

- Owned by [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)
