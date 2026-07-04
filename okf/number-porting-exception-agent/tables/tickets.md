---
type: Data Entity
title: tickets
description: Data entity tickets owned by Zendesk.
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# tickets

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

- Owned by [Zendesk](/systems/zendesk.md)
