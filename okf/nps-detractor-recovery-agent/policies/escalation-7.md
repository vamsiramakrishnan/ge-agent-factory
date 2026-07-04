---
type: Policy
title: Escalation policy 7
description: "When The same account_number produces a second detractor satisfaction_scores response (score 0-6) within a rolling 90 days after a prior recovery case in tickets was already marked resolved; action: escalate_to_human; handoff: win-back retention specialist"
source_id: "escalation-7"
tags:
  - telco
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
| The same account_number produces a second detractor satisfaction_scores response (score 0-6) within a rolling 90 days after a prior recovery case in tickets was already marked resolved | escalate_to_human | win-back retention specialist | A repeat detractor score after a closed recovery case shows the remedy didn't stick; the account needs a higher-authority save conversation, not another scripted case. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
