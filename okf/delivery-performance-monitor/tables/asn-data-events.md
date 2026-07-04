---
type: Data Entity
title: asn_data_events
description: Data entity asn_data_events owned by ASN Data.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# asn_data_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| asn_data_record_id | ref | required |

# Citations

- Owned by [ASN Data](/systems/asn-data.md)
