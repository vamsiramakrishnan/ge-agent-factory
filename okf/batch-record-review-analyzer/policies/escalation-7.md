---
type: Policy
title: Escalation policy 7
description: "When A quality_checks record shows result=fail or conditional on a characteristic tied to an inspection_lots record with skip_lot=true; action: escalate_to_human; handoff: quality_engineer"
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
| A quality_checks record shows result=fail or conditional on a characteristic tied to an inspection_lots record with skip_lot=true | escalate_to_human | quality_engineer | A failing measurement under a skip-lot regime means the reduced-sampling plan itself may no longer be valid for this lot; only the QE can authorize reverting to full inspection before disposition. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
