---
type: Data Entity
title: carrier_reports_events
description: Data entity carrier_reports_events owned by Carrier Reports.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# carrier_reports_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| carrier_reports_record_id | ref | required |

# Citations

- Owned by [Carrier Reports](/systems/carrier-reports.md)
