---
type: Data Entity
title: ofac_sdn_events
description: Data entity ofac_sdn_events owned by OFAC/SDN.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ofac_sdn_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| ofac_sdn_record_id | ref | required |

# Citations

- Owned by [OFAC/SDN](/systems/ofac-sdn.md)
