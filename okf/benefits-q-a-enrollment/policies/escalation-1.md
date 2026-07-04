---
type: Policy
title: Escalation policy 1
description: "When Employee is on_leave or inactive in Workday; action: escalate_to_human; handoff: Total Rewards HRBP"
source_id: "escalation-1"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.0
generation_status: generated
ge_status: generated
---

# Escalation policy 1

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.0

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Employee is on_leave or inactive in Workday | escalate_to_human | Total Rewards HRBP | Only active employees can self-serve enrollments through this agent; leave-status changes require HRBP review. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
