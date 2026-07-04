---
type: Data Entity
title: linkedin_talent_insights_records
description: Data entity linkedin_talent_insights_records owned by LinkedIn Talent Insights.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# linkedin_talent_insights_records

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

- Owned by [LinkedIn Talent Insights](/systems/linkedin-talent-insights.md)
