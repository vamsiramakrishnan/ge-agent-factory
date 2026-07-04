---
type: Data Entity
title: alerts
description: Data entity alerts owned by Datadog APM.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# alerts

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

- Owned by [Datadog APM](/systems/datadog-apm.md)
