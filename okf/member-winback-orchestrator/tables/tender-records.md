---
type: Data Entity
title: tender_records
description: Data entity tender_records owned by Oracle Xstore POS.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# tender_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| transaction_number | number | required |
| tender_sequence | number | required |
| tender_type | enum | required; values: credit, debit, cash, gift_card, mobile_wallet, ebt |
| tender_amount | float | required |
| auth_code | number |  |
| settlement_date | date | required |
| offline_authorization_flag | boolean | required |
| chargeback_flag | boolean | required |

# Citations

- Owned by [Oracle Xstore POS](/systems/oracle-xstore-pos.md)
