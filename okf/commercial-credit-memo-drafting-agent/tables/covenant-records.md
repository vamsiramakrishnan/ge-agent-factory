---
type: Data Entity
title: covenant_records
description: Data entity covenant_records owned by nCino Loan Origination.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# covenant_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| covenant_id | number | required |
| application_number | number | required |
| covenant_type | enum | required; values: minimum_dscr, maximum_leverage, minimum_liquidity, maximum_capex, borrowing_base_compliance, minimum_tangible_net_worth |
| test_frequency | enum | required; values: monthly, quarterly, semiannual, annual |
| threshold_value | float | required |
| most_recent_test_value | float | required |
| compliance_status | enum | required; values: in_compliance, waived, breached, cured |
| next_test_date | date | required |
| waiver_fee_assessed | boolean |  |

# Citations

- Owned by [nCino Loan Origination](/systems/ncino-loan-origination.md)
