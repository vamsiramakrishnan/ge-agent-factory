---
type: Data Entity
title: interventions
description: Data entity interventions owned by BigQuery.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# interventions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| employee_id | ref | required |
| type | enum | required; values: compensation_review, career_conversation, manager_coaching, development_opportunity |
| status | enum | required; values: recommended, in_progress, completed |
| outcome_rating | number |  |

# Citations

- Owned by [BigQuery](/systems/bigquery.md)
