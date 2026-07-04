---
type: Data Entity
title: thread_replies
description: Data entity thread_replies owned by Slack.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# thread_replies

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

- Owned by [Slack](/systems/slack.md)
