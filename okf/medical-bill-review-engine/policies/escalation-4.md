---
type: Policy
title: Escalation policy 4
description: "When Any single reserve transaction exceeding $50,000 or cumulative incurred crossing $100,000 on one claim; action: escalate_to_human; handoff: Claims manager with $250K reserve authority"
source_id: "escalation-4"
tags:
  - insurance
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
| Any single reserve transaction exceeding $50,000 or cumulative incurred crossing $100,000 on one claim | escalate_to_human | Claims manager with $250K reserve authority | Reserve authority grids are a regulatory and statutory-accounting control; reserves above the desk adjuster's letter of authority must be set by the authority holder of record. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
