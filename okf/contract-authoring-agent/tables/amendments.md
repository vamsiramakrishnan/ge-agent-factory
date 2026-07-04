---
type: Data Entity
title: amendments
description: Data entity amendments owned by Icertis.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# amendments

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

# Citations

- Owned by [Icertis](/systems/icertis.md)
