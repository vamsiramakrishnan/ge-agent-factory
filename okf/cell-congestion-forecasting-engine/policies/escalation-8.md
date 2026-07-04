---
type: Policy
title: Escalation policy 8
description: "When A predicted new site build or carrier add would push cumulative quarterly augment spend past the capacity board's approved budget ceiling; action: escalate_to_human; handoff: capacity_board"
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
| A predicted new site build or carrier add would push cumulative quarterly augment spend past the capacity board's approved budget ceiling | escalate_to_human | capacity_board | Budget-ceiling breaches require capacity board reallocation approval before the agent can publish or commit the plan. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
