---
type: Data Entity
title: cch_answerconnect_events
description: Data entity cch_answerconnect_events owned by CCH AnswerConnect.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# cch_answerconnect_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| cch_answerconnect_record_id | ref | required |

# Citations

- Owned by [CCH AnswerConnect](/systems/cch-answerconnect.md)
