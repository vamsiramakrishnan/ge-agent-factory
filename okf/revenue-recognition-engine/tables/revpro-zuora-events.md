---
type: Data Entity
title: revpro_zuora_events
description: Data entity revpro_zuora_events owned by RevPro/Zuora.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# revpro_zuora_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| revpro_zuora_record_id | ref | required |

# Citations

- Owned by [RevPro/Zuora](/systems/revpro-zuora.md)
