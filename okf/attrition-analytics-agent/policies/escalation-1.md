---
type: Policy
title: Escalation policy 1
description: "When Model fairness flag is tripped (protected-attribute bias detected in feature importance); action: escalate_to_human; handoff: People Analytics Lead"
source_id: "escalation-1"
tags:
  - hr
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
| Model fairness flag is tripped (protected-attribute bias detected in feature importance) | escalate_to_human | People Analytics Lead | Fairness concerns in attrition prediction require manual review before any HRBP actionability. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
