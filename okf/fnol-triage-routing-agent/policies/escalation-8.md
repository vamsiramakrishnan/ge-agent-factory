---
type: Policy
title: Escalation policy 8
description: "When cat_code is not 'none' and same-day FNOL volume for that PCS event exceeds the desk's standard daily intake threshold; action: escalate_to_human; handoff: CAT operations manager"
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
| cat_code is not 'none' and same-day FNOL volume for that PCS event exceeds the desk's standard daily intake threshold | escalate_to_human | CAT operations manager | A declared catastrophe event requires surge-adjuster deployment and jurisdiction-specific CAT response protocols that sit outside the standard FNOL routing queue's authority. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
