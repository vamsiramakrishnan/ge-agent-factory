---
type: Policy
title: Escalation policy 3
description: "When Life event is older than the QLE window in the SOP; action: refuse"
source_id: "escalation-3"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.2
generation_status: generated
ge_status: generated
---

# Escalation policy 3

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.2

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Life event is older than the QLE window in the SOP | refuse |  | QLE window is a hard policy limit; cite life-event-processing-sop.qle-window and direct the employee to open enrollment instead. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
