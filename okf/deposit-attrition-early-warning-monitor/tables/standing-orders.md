---
type: Data Entity
title: standing_orders
description: Data entity standing_orders owned by Temenos Transact.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# standing_orders

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| order_reference | number | required |
| account_number | number | required |
| frequency | enum | required; values: weekly, biweekly, semimonthly, monthly, quarterly |
| amount | float | required |
| next_execution_date | date | required |
| beneficiary_name | person.fullName | required |
| order_status | enum | required; values: active, suspended, expired, cancelled |
| retry_on_insufficient_funds | boolean | required |

# Citations

- Owned by [Temenos Transact](/systems/temenos-transact.md)
