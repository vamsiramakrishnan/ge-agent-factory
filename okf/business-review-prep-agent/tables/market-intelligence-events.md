---
type: Data Entity
title: market_intelligence_events
description: Data entity market_intelligence_events owned by Market Intelligence.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# market_intelligence_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| market_intelligence_record_id | ref | required |

# Citations

- Owned by [Market Intelligence](/systems/market-intelligence.md)
