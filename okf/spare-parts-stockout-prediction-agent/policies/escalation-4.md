---
type: Policy
title: Escalation policy 4
description: "When Vibration velocity reading enters ISO 10816/20816 zone D on an asset with criticality_ranking a_constraint; action: escalate_to_human; handoff: reliability_engineer"
source_id: "escalation-4"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Vibration velocity reading enters ISO 10816/20816 zone D on an asset with criticality_ranking a_constraint | escalate_to_human | reliability_engineer | Zone D means damage is probable with continued operation; on a constraint asset the run/shutdown tradeoff is a senior reliability call weighing catastrophic failure against lost throughput. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
