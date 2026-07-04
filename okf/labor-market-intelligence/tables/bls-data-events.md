---
type: Data Entity
title: bls_data_events
description: Data entity bls_data_events owned by BLS Data.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# bls_data_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| bls_data_record_id | ref | required |

# Citations

- Owned by [BLS Data](/systems/bls-data.md)
