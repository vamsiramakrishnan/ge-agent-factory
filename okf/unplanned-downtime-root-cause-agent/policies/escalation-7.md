---
type: Policy
title: Escalation policy 7
description: "When The same asset_number logs a fault_alarm or e_stop machine_event three or more times within a single 8-hour shift; action: escalate_to_human; handoff: Maintenance Reliability Engineer"
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
| The same asset_number logs a fault_alarm or e_stop machine_event three or more times within a single 8-hour shift | escalate_to_human | Maintenance Reliability Engineer | Repeat trips on one asset inside a shift signal an unresolved failure mode; re-clearing the alarm again without a root-cause repair risks a catastrophic failure and violates the repeat-offender clause in the SOP. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
