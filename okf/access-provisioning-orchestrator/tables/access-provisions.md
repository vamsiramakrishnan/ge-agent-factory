---
type: Data Entity
title: access_provisions
description: Data entity access_provisions owned by Okta.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# access_provisions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| hr_event_id | ref | required |
| employee_id | ref | required |
| role_template_id | ref | required |
| status | enum | required; values: pending, provisioned, escalated, revoked |
| provisioned_at | date.recent |  |
| ticket_id | string |  |

# Citations

- Owned by [Okta](/systems/okta.md)
