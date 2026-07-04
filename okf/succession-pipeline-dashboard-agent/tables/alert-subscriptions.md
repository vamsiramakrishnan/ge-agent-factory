---
type: Data Entity
title: alert_subscriptions
description: Data entity alert_subscriptions owned by Tableau.
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# alert_subscriptions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| title | lorem.sentence | required |
| priority | enum | required; values: P1, P2, P3, P4 |
| status | enum | required; values: open, triaged, in_progress, resolved, closed |
| assignee | person.fullName | required |
| created_at | date | required |
| category | enum | required; values: access, hardware, software, network, policy, billing |
| sla_met | boolean |  |

# Citations

- Owned by [Tableau](/systems/tableau.md)
