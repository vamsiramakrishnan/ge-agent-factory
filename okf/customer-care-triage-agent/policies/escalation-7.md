---
type: Policy
title: Escalation policy 7
description: "When A single online_orders record accumulates 3 or more tickets referencing the same order_number within 7 days, or cumulative appeasement value against that order exceeds the Appeasement & Return Authority Matrix tier cap; action: escalate_to_human; handoff: Customer Care Director"
source_id: "escalation-7"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.6
generation_status: generated
ge_status: generated
---

# Escalation policy 7

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.6

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A single online_orders record accumulates 3 or more tickets referencing the same order_number within 7 days, or cumulative appeasement value against that order exceeds the Appeasement & Return Authority Matrix tier cap | escalate_to_human | Customer Care Director | Repeated contacts on one order signal an unresolved root cause or possible policy abuse that automated appeasement limits aren't designed to catch. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
