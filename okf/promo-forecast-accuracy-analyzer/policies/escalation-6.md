---
type: Policy
title: Escalation policy 6
description: "When An elasticity-model recommendation lands more than 20% away from the current zone retail, or the model's holdout WMAPE exceeds 0.30 for the SKU in question.; action: request_more_info; handoff: pricing_science_team"
source_id: "escalation-6"
tags:
  - retail
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
| An elasticity-model recommendation lands more than 20% away from the current zone retail, or the model's holdout WMAPE exceeds 0.30 for the SKU in question. | request_more_info | pricing_science_team | Recommendations outside guardrails or from low-confidence models usually reflect sparse price-variation history; the model needs review before its output is actioned. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
