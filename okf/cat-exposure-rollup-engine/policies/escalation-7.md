---
type: Policy
title: Escalation policy 7
description: "When Aggregated TIV for any single county or coastal band reaches 90% of its assigned zone appetite limit before the quarter closes; action: escalate_to_human; handoff: Chief Underwriting Officer"
source_id: "escalation-7"
tags:
  - insurance
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
| Aggregated TIV for any single county or coastal band reaches 90% of its assigned zone appetite limit before the quarter closes | escalate_to_human | Chief Underwriting Officer | A near-limit accumulation requires an underwriting bind/hold decision on new business before the limit is breached, and only underwriting authority can make that call. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
