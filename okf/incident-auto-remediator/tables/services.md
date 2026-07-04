---
type: Data Entity
title: services
description: Data entity services owned by Kubernetes.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# services

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| team_id | ref |  |
| name | word.noun | required |
| deployment_version | lorem.word | required |
| last_deployed_at | date.recent | required |
| is_security_tagged | boolean | required |

# Citations

- Owned by [Kubernetes](/systems/kubernetes.md)
