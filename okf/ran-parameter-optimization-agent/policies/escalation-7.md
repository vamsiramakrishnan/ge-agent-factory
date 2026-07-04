---
type: Policy
title: Escalation policy 7
description: "When A recommended tilt or power change would move a cell's predicted coverage below the required overlap with its neighbor list, risking a coverage hole; action: request_more_info; handoff: RF Optimization Engineer"
source_id: "escalation-7"
tags:
  - telco
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
| A recommended tilt or power change would move a cell's predicted coverage below the required overlap with its neighbor list, risking a coverage hole | request_more_info | RF Optimization Engineer | Overlap-degrading changes can trade a drop-call fix for a coverage hole elsewhere; the engineer must review neighbor-list impact before the change is staged. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
