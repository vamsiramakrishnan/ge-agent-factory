---
type: Data Entity
title: internal_orders
description: Data entity internal_orders owned by SAP S/4HANA CO/FI.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# internal_orders

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

- Owned by [SAP S/4HANA CO/FI](/systems/sap-s-4hana-co-fi.md)
