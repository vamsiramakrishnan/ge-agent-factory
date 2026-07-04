---
type: Policy
title: Escalation policy 8
description: "When No technician_schedules record with the required primary_skill and available capacity in the ticket's appointment_window exists at the assigned garage_location; action: escalate_to_human; handoff: dispatch_supervisor"
source_id: "escalation-8"
tags:
  - telco
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
| No technician_schedules record with the required primary_skill and available capacity in the ticket's appointment_window exists at the assigned garage_location | escalate_to_human | dispatch_supervisor | Booking a skill-mismatched or overloaded technician recreates the exact no-fault-found and returned-incomplete outcomes this agent exists to prevent; the dispatch supervisor must approve an out-of-zone or overtime assignment. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
