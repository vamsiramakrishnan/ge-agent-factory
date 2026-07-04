---
type: Policy
title: Escalation policy 7
description: "When The same store_number posts a planogram compliance rate below 80% (or repeats a missing-item violation tied to the same merchandise_hierarchy class_number) across three consecutive reset windows; action: escalate_to_human; handoff: district_merchandising_manager"
source_id: "escalation-7"
tags:
  - retail
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
| The same store_number posts a planogram compliance rate below 80% (or repeats a missing-item violation tied to the same merchandise_hierarchy class_number) across three consecutive reset windows | escalate_to_human | district_merchandising_manager | Chronic, store-specific non-compliance signals a root cause (labor, space, or vendor fulfillment) that a corrective task alone won't fix and needs district-level intervention. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
