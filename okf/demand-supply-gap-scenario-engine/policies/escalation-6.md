---
type: Policy
title: Escalation policy 6
description: "When Approved scenario run projects service level below the 90% contractual floor for any strategic customer; action: escalate_to_human; handoff: sandop_process_owner"
source_id: "escalation-6"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Approved scenario run projects service level below the 90% contractual floor for any strategic customer | escalate_to_human | sandop_process_owner | Publishing a plan that knowingly breaches a contractual service commitment is an executive tradeoff (expedite spend vs. penalty exposure), and must be decided in the S&OP forum. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
