---
type: Data Entity
title: irs_tin_matching_events
description: Data entity irs_tin_matching_events owned by IRS TIN Matching.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# irs_tin_matching_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| irs_tin_matching_record_id | ref | required |

# Citations

- Owned by [IRS TIN Matching](/systems/irs-tin-matching.md)
