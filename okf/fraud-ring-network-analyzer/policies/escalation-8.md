---
type: Policy
title: Escalation policy 8
description: "When Two or more open siu_referrals tied to the same network_link_indicators cluster list different assigned_investigator values; action: request_more_info; handoff: SIU Manager"
source_id: "escalation-8"
tags:
  - insurance
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
| Two or more open siu_referrals tied to the same network_link_indicators cluster list different assigned_investigator values | request_more_info | SIU Manager | Split ownership of linked claims risks duplicate or contradictory investigative actions and must be reconciled under a single case owner before any file action proceeds. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
