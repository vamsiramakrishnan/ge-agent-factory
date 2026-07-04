---
type: Policy
title: Escalation policy 2
description: "When Interviewer has 'do_not_schedule' flag set in Workday; action: refuse"
source_id: "escalation-2"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.1
generation_status: generated
ge_status: generated
---

# Escalation policy 2

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.1

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Interviewer has 'do_not_schedule' flag set in Workday | refuse |  | Agent must respect Workday org flags; do not attempt to schedule flagged interviewers. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
