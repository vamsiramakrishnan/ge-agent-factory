---
type: Data Entity
title: vendor_master_events
description: Data entity vendor_master_events owned by Vendor Master.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# vendor_master_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | company.name | required |
| category | enum | required; values: IT, Consulting, Manufacturing, Logistics, Facilities, Marketing |
| rating | number | required |
| annual_spend | number | required |
| risk_score | enum | required; values: low, medium, high |
| status | enum | required; values: active, pending_review, terminated |
| onboarded_on | date | required |
| vendor_master_record_id | ref | required |

# Citations

- Owned by [Vendor Master](/systems/vendor-master.md)
