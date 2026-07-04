---
type: Data Entity
title: supplier_marketplaces_events
description: Data entity supplier_marketplaces_events owned by Supplier marketplaces.
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# supplier_marketplaces_events

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
| supplier_marketplaces_record_id | ref | required |

# Citations

- Owned by [Supplier marketplaces](/systems/supplier-marketplaces.md)
