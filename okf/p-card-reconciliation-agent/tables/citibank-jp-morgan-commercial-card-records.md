---
type: Data Entity
title: citibank_jp_morgan_commercial_card_records
description: Data entity citibank_jp_morgan_commercial_card_records owned by Citibank/JP Morgan Commercial Card.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# citibank_jp_morgan_commercial_card_records

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

- Owned by [Citibank/JP Morgan Commercial Card](/systems/citibank-jp-morgan-commercial-card.md)
