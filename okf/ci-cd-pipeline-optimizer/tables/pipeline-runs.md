---
type: Data Entity
title: pipeline_runs
description: Data entity pipeline_runs owned by Jenkins.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# pipeline_runs

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

- Owned by [Jenkins](/systems/jenkins.md)
