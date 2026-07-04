---
type: Data Entity
title: core_accounts
description: Data entity core_accounts owned by Temenos Transact.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# core_accounts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| account_number | number | required |
| product_type | enum | required; values: checking, savings, money_market, cd, hsa, iolta |
| account_status | enum | required; values: open, dormant, restricted, closed, charged_off |
| current_balance | float | required |
| available_balance | float | required |
| hold_amount | float |  |
| open_date | date | required |
| reg_dd_disclosure_acknowledged | boolean | required |
| primary_holder_name | person.fullName | required |

# Citations

- Owned by [Temenos Transact](/systems/temenos-transact.md)
