---
type: Policy
title: Escalation policy 7
description: "When The published restoration ETA on an active incidents record slips by more than 4 hours from the originally published ETA, or is revised a third time; action: escalate_to_human; handoff: NOC Duty Manager"
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
| The published restoration ETA on an active incidents record slips by more than 4 hours from the originally published ETA, or is revised a third time | escalate_to_human | NOC Duty Manager | Repeated ETA revisions erode customer trust faster than silence; a third revision needs NOC judgment on the underlying restoration estimate, not another automated re-publish. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
