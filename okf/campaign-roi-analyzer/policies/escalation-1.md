---
type: Policy
title: Escalation policy 1
description: "When Recommendation reallocates >$100k from one channel to another; action: escalate_to_human; handoff: CMO for budget approval"
source_id: "escalation-1"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.0
generation_status: generated
ge_status: generated
---

# Escalation policy 1

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.0

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Recommendation reallocates >$100k from one channel to another | escalate_to_human | CMO for budget approval | Large reallocations require executive review and approval before publication to avoid unauthorized budget movement. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
