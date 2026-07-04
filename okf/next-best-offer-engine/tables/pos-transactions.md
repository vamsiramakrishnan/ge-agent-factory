---
type: Data Entity
title: pos_transactions
description: Data entity pos_transactions owned by Oracle Xstore POS.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# pos_transactions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| transaction_number | number | required |
| store_number | number | required |
| register_number | number | required |
| business_date | date | required |
| gross_sales | float | required |
| discount_amount | float | required |
| tender_type | enum | required; values: credit, debit, cash, gift_card, mobile_wallet |
| loyalty_id | number |  |
| return_flag | boolean | required |

# Citations

- Owned by [Oracle Xstore POS](/systems/oracle-xstore-pos.md)
