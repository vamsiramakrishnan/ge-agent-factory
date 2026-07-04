---
type: Data Entity
title: remediation_executions
description: Data entity remediation_executions owned by Kubernetes.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# remediation_executions

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| incident_id | ref | required |
| runbook_id | ref | required |
| executed_by | lorem.word | required |
| executed_at | date.recent | required |
| outcome | enum | required; values: success, partial_success, failure |

# Citations

- Owned by [Kubernetes](/systems/kubernetes.md)
