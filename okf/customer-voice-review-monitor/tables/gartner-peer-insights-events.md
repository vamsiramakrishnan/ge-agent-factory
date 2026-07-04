---
type: Data Entity
title: gartner_peer_insights_events
description: Data entity gartner_peer_insights_events owned by Gartner Peer Insights.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# gartner_peer_insights_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| gartner_peer_insights_record_id | ref | required |

# Citations

- Owned by [Gartner Peer Insights](/systems/gartner-peer-insights.md)
