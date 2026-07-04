---
type: Data Entity
title: engagement_responses
description: Data entity engagement_responses owned by Culture Amp.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# engagement_responses

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | ref | required |
| survey_cycle | enum | required; values: Q1-2025, Q2-2025, Q3-2025 |
| theme | enum | required; values: leadership, growth, belonging, compensation, work-life-balance |
| score | number | required |

# Citations

- Owned by [Culture Amp](/systems/culture-amp.md)
