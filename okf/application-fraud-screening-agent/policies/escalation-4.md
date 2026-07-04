---
type: Policy
title: Escalation policy 4
description: "When Fraud score at or above 700 combined with two or more network link indicators sharing an entity across open claims; action: escalate_to_human; handoff: SIU field investigator"
source_id: "escalation-4"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Fraud score at or above 700 combined with two or more network link indicators sharing an entity across open claims | escalate_to_human | SIU field investigator | Organized-ring indicators require licensed investigative work (recorded statements, scene work, EUO recommendation) that state SIU regulations reserve to qualified investigators. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
