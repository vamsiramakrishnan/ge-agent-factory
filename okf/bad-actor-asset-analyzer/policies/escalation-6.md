---
type: Policy
title: Escalation policy 6
description: "When Emergency-priority work order raised against a boiler, pressure vessel, or other code-stamped equipment; action: escalate_to_human; handoff: authorized_inspector"
source_id: "escalation-6"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Emergency-priority work order raised against a boiler, pressure vessel, or other code-stamped equipment | escalate_to_human | authorized_inspector | ASME/NBIC jurisdictional equipment may not be repaired ad hoc — repairs need an authorized inspector and an R-stamp holder, and an improper weld repair is a life-safety event. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
