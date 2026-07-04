---
type: Data Entity
title: settlement_records
description: Data entity settlement_records owned by FIS Payments Hub.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# settlement_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| settlement_id | number | required |
| batch_number | number | required |
| settlement_system | enum | required; values: fed_master_account, chips_prefunded_balance, national_settlement_service, dtc_money_settlement |
| net_settlement_amount | float | required |
| settlement_date | date | required |
| finality_status | enum | required; values: provisional, final, unwound |
| fed_reference_number | number | required |
| gl_reconciled | boolean | required |

# Citations

- Owned by [FIS Payments Hub](/systems/fis-payments-hub.md)
