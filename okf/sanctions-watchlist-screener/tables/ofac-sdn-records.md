---
type: Data Entity
title: ofac_sdn_records
description: Data entity ofac_sdn_records owned by OFAC/SDN.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ofac_sdn_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| status | enum | required; values: active, pending, closed |
| owner | person.fullName | required |
| created_at | date | required |
| notes | lorem.sentence |  |

# Citations

- Owned by [OFAC/SDN](/systems/ofac-sdn.md)
