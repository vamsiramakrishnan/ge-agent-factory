---
type: Data Entity
title: gartner_peer_insights_records
description: Data entity gartner_peer_insights_records owned by Gartner Peer Insights.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# gartner_peer_insights_records

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| source_record_id | seq | required |
| status | enum | required; values: active, pending, closed |
| owner | person.fullName | required |
| created_at | date | required |
| notes | lorem.sentence |  |

# Citations

- Owned by [Gartner Peer Insights](/systems/gartner-peer-insights.md)
