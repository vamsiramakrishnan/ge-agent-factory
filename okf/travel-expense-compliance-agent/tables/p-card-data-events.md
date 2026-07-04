---
type: Data Entity
title: p_card_data_events
description: "Data entity p_card_data_events owned by P-card data."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# p_card_data_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| p_card_data_record_id | ref | required |

# Citations

- Owned by [P-card data](/systems/p-card-data.md)
