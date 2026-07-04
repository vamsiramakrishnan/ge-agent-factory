---
type: Policy
title: Escalation policy 8
description: "When A PM task proposed for interval extension has fewer than 25 completed work-order cycles of history in maintenance_work_orders; action: request_more_info; handoff: Maintenance Planner"
source_id: "escalation-8"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A PM task proposed for interval extension has fewer than 25 completed work-order cycles of history in maintenance_work_orders | request_more_info | Maintenance Planner | A zero-finding pattern built on a thin sample of completed cycles is not a reliable basis for loosening a PM interval; more history is needed before the recommendation can be trusted. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
