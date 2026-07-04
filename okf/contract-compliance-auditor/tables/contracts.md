---
type: Data Entity
title: contracts
description: Data entity contracts owned by Icertis.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# contracts

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| vendor_id | ref | required |
| status | enum | required; values: draft, active, expired, terminated |
| effective_date | date.recent | required |
| term_months | number | required |
| category | enum | required; values: raw_materials, mro, services, capital |

# Citations

- Owned by [Icertis](/systems/icertis.md)
