---
type: Data Entity
title: positions
description: Data entity positions owned by Murex MX.3.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# positions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| position_id | number | required |
| cusip | number | required |
| book_designation | enum | required; values: trading_book, afs_portfolio, htm_portfolio, hedge_accounting_book |
| market_value | float | required |
| notional_amount | float | required |
| unrealized_gain_loss | float | required |
| effective_duration | float | required |
| aoci_designated | boolean | required |
| as_of_date | date | required |

# Citations

- Owned by [Murex MX.3](/systems/murex-mx-3.md)
