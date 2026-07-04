---
type: Policy
title: Escalation policy 7
description: "When Computed energy intensity for a line exceeds the site's historical_metrics ceiling by more than 15% for two consecutive days; action: escalate_to_human; handoff: Plant Energy Manager"
source_id: "escalation-7"
tags:
  - manufacturing
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
| Computed energy intensity for a line exceeds the site's historical_metrics ceiling by more than 15% for two consecutive days | escalate_to_human | Plant Energy Manager | A sustained double-digit overshoot against the historical baseline usually means a control-loop or equipment failure, not noise, and needs a maintenance work order rather than another automated recompute. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
