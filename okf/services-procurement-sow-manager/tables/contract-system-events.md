---
type: Data Entity
title: contract_system_events
description: Data entity contract_system_events owned by Contract system.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# contract_system_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| counterparty | company.name | required |
| value | number | required |
| currency | enum | required; values: USD, EUR, GBP |
| start_date | date | required |
| end_date | date | required |
| status | enum | required; values: draft, negotiating, active, expired, terminated |
| auto_renew | boolean |  |
| contract_system_record_id | ref | required |

# Citations

- Owned by [Contract system](/systems/contract-system.md)
