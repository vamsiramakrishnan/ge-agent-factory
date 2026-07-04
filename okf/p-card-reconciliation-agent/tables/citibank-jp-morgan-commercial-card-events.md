---
type: Data Entity
title: citibank_jp_morgan_commercial_card_events
description: Data entity citibank_jp_morgan_commercial_card_events owned by Citibank/JP Morgan Commercial Card.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# citibank_jp_morgan_commercial_card_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| citibank_jp_morgan_commercial_card_record_id | ref | required |

# Citations

- Owned by [Citibank/JP Morgan Commercial Card](/systems/citibank-jp-morgan-commercial-card.md)
