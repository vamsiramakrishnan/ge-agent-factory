---
type: Policy
title: Escalation policy 6
description: "When Second missed appointment on the same work order, or projected jeopardy on a regulated installation interval; action: escalate_to_human; handoff: dispatch_supervisor"
source_id: "escalation-6"
tags:
  - telco
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
| Second missed appointment on the same work order, or projected jeopardy on a regulated installation interval | escalate_to_human | dispatch_supervisor | Two misses puts the order into customer-detractor and potential PUC service-quality-metric territory; a supervisor must lock a guaranteed window and confirm technician skill match rather than letting auto-scheduling retry. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
