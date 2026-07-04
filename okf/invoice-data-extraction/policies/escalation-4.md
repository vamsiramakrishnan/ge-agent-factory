---
type: Policy
title: Escalation policy 4
description: "When Duplicate invoice candidate detected (same vendor, amount, date within 7 days); action: refuse"
source_id: "escalation-4"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
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
| Duplicate invoice candidate detected (same vendor, amount, date within 7 days) | refuse |  | Refuse posting and route to exception queue; duplicate invoices must be resolved by AP team before posting. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
