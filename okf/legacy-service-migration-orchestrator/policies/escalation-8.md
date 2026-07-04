---
type: Policy
title: Escalation policy 8
description: "When Three or more service_orders scheduled for the same serving terminal collide with the same open, unresolved change_requests freeze window; action: escalate_to_human; handoff: Provisioning Engineer"
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
| Three or more service_orders scheduled for the same serving terminal collide with the same open, unresolved change_requests freeze window | escalate_to_human | Provisioning Engineer | Stacking multiple cutovers against one contested freeze window multiplies blast radius if the change is denied or rolled back late; a human must re-sequence before batching proceeds. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
