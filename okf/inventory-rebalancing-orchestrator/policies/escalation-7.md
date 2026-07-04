---
type: Policy
title: Escalation policy 7
description: "When A candidate transfer's freight or expedite cost exceeds the single-approver dollar threshold defined in the Inter-Site Transfer Authorization Matrix; action: escalate_to_human; handoff: materials_manager"
source_id: "escalation-7"
tags:
  - manufacturing
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
| A candidate transfer's freight or expedite cost exceeds the single-approver dollar threshold defined in the Inter-Site Transfer Authorization Matrix | escalate_to_human | materials_manager | Above-threshold freight spend requires a co-signed approval per the Authorization Matrix; the agent's cost-trade-off analysis is advisory, not an authorization to spend at that tier. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
