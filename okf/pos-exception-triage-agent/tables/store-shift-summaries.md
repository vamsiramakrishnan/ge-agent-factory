---
type: Data Entity
title: store_shift_summaries
description: Data entity store_shift_summaries owned by Oracle Xstore POS.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# store_shift_summaries

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| store_number | number | required |
| business_date | date | required |
| shift_code | enum | required; values: opening, midday, closing, overnight |
| shift_lead_name | person.fullName | required |
| transaction_count | number | required |
| net_sales | float | required |
| cash_over_short | float | required |
| safe_drop_total | float |  |
| void_count | number | required |

# Citations

- Owned by [Oracle Xstore POS](/systems/oracle-xstore-pos.md)
