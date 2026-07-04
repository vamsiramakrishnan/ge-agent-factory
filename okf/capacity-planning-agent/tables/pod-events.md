---
type: Data Entity
title: pod_events
description: Data entity pod_events owned by Kubernetes.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# pod_events

# Schema

| Field | Type | Constraints |
| --- | --- | --- |
| id | seq | required; primary key |
| actor | person.fullName | required |
| action | enum | required; values: create, update, delete, approve, reject, escalate, view, share |
| target_type | lorem.words | required |
| created_at | date | required |
| notes | lorem.sentence |  |
| workload_id | ref | required |

# Citations

- Owned by [Kubernetes](/systems/kubernetes.md)
