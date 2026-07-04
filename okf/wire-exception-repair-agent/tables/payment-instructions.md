---
type: Data Entity
title: payment_instructions
description: Data entity payment_instructions owned by FIS Payments Hub.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# payment_instructions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| instruction_id | number | required |
| message_type | enum | required; values: pacs_008, pain_001, pacs_009, pain_008, camt_056 |
| payment_rail | enum | required; values: fedwire, ach_same_day, ach_standard, rtp, fednow, chips, swift_cross_border |
| amount | float | required |
| currency | enum | required; values: USD, EUR, GBP, MXN, JPY, CAD |
| value_date | date | required |
| ofac_screening_status | enum | required; values: clear, pending, potential_match, blocked |
| originator_name | company.name | required |
| beneficiary_aba_routing | number | required |

# Citations

- Owned by [FIS Payments Hub](/systems/fis-payments-hub.md)
