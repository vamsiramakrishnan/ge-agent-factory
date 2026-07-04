---
type: Data Entity
title: messages
description: Data entity messages owned by Google Chat.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# messages

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | ref | required |
| channel | enum | required; values: google_chat |
| body | lorem.paragraph | required |
| status | enum | required; values: draft, sent, delivered, failed |

# Citations

- Owned by [Google Chat](/systems/google-chat.md)
