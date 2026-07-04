---
type: Data Entity
title: account_transactions
description: Data entity account_transactions owned by Temenos Transact.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# account_transactions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| transaction_id | number | required |
| account_number | number | required |
| transaction_type | enum | required; values: ach_credit, ach_debit, wire_in, wire_out, check_deposit, card_purchase, atm_withdrawal, teller_cash_deposit |
| amount | float | required |
| post_date | date | required |
| channel | enum | required; values: branch, atm, online, mobile, batch_ach, wire_room |
| reg_e_dispute_flag | boolean | required |
| memo_text | lorem.sentence |  |

# Citations

- Owned by [Temenos Transact](/systems/temenos-transact.md)
