---
type: Policy
title: Escalation policy 3
description: "When Pod restart count exceeds 3 in the last 24 hours; action: escalate_to_human; handoff: SRE Manager"
source_id: "escalation-3"
tags:
  - it
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
| Pod restart count exceeds 3 in the last 24 hours | escalate_to_human | SRE Manager | Repeated restarts on the same pod indicate a regression or fundamental issue requiring investigation. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
