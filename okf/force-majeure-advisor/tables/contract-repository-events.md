---
type: Data Entity
title: contract_repository_events
description: Data entity contract_repository_events owned by Contract Repository.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# contract_repository_events

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
| contract_repository_record_id | ref | required |

# Citations

- Owned by [Contract Repository](/systems/contract-repository.md)
