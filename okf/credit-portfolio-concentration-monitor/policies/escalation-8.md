---
type: Policy
title: Escalation policy 8
description: "When Pipeline simulation shows a pending loan_applications record in decision_status submitted or underwriting would bring aggregate obligor-group exposure within 5% of the legal lending limit; action: request_more_info; handoff: relationship_manager"
source_id: "escalation-8"
tags:
  - banking
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
| Pipeline simulation shows a pending loan_applications record in decision_status submitted or underwriting would bring aggregate obligor-group exposure within 5% of the legal lending limit | request_more_info | relationship_manager | Near-limit pipeline deals need confirmed final commitment terms from the relationship_manager before the concentration model can certify remaining capacity, avoiding a booked breach discovered after the fact. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
