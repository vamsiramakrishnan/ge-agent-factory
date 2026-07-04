---
type: Data Entity
title: messages
description: Data entity messages owned by Slack.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# messages

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
