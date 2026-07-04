---
type: Data Entity
title: workloads
description: Data entity workloads owned by Kubernetes.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# workloads

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| name | lorem.words | required |
| status | enum | required; values: pending, running, succeeded, failed, rolled_back |
| duration_seconds | number | required |
| started_at | date | required |
| environment | enum | required; values: dev, staging, prod |

# Citations

- Owned by [Kubernetes](/systems/kubernetes.md)
