---
type: Policy
title: Escalation policy 7
description: "When A recommended PM interval extension would exceed the warranty-preserving bound documented in the PM Interval Revision & OEM Warranty Compliance Policy for that asset's asset_class; action: escalate_to_human; handoff: maintenance_manager"
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
| A recommended PM interval extension would exceed the warranty-preserving bound documented in the PM Interval Revision & OEM Warranty Compliance Policy for that asset's asset_class | escalate_to_human | maintenance_manager | Trading OEM warranty coverage for reduced PM labor hours is a cost tradeoff that sits above the planner's authority and needs manager sign-off before it reaches the route package. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
