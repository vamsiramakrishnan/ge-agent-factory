---
type: Data Entity
title: market_intel_events
description: Data entity market_intel_events owned by Market intel.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# market_intel_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| market_intel_record_id | ref | required |

# Citations

- Owned by [Market intel](/systems/market-intel.md)
