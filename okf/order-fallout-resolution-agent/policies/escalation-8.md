---
type: Policy
title: Escalation policy 8
description: "When A wholesale-segment service order's fallout is linked to a change_requests record with sla_met = false; action: escalate_to_human; handoff: wholesale_carrier_relations"
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
| A wholesale-segment service order's fallout is linked to a change_requests record with sla_met = false | escalate_to_human | wholesale_carrier_relations | Wholesale orders operate under interconnection agreements with their own remedy clauses; an SLA miss on the linked change request signals a cross-carrier dispute that only carrier relations can resolve. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
