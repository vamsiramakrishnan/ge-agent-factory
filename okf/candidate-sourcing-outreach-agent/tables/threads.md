---
type: Data Entity
title: threads
description: Data entity threads owned by Gmail.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# threads

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| channel | lorem.words | required |
| author | person.fullName | required |
| body | lorem.sentence | required |
| sentiment | enum | required; values: positive, neutral, negative |
| sent_at | date | required |

# Citations

- Owned by [Gmail](/systems/gmail.md)
