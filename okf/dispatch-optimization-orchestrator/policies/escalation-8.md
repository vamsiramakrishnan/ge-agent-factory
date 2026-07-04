---
type: Policy
title: Escalation policy 8
description: "When Emergency insertion would require pulling a technician off a work order already at wo_status on_site to service a new emergency ticket; action: request_more_info"
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
| Emergency insertion would require pulling a technician off a work order already at wo_status on_site to service a new emergency ticket | request_more_info |  | Pulling a technician off in-progress work doubles truck rolls and abandons a partially completed job; the supervisor must confirm the emergency's priority before the agent recommends interrupting active work. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
