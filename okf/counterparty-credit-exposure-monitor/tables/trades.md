---
type: Data Entity
title: trades
description: Data entity trades owned by Murex MX.3.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# trades

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| trade_id | number | required |
| cusip | number | required |
| instrument_type | enum | required; values: ust_note, agency_mbs_pool, ig_corporate_bond, municipal_go, interest_rate_swap, fx_forward |
| side | enum | required; values: buy, sell |
| notional_amount | float | required |
| trade_date | date | required |
| settlement_status | enum | required; values: pending_match, matched, settled, failed_delivery |
| counterparty_name | company.name | required |
| executing_trader | person.fullName | required |

# Citations

- Owned by [Murex MX.3](/systems/murex-mx-3.md)
