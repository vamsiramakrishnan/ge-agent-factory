---
type: Policy
title: Escalation policy 7
description: "When A live changeover on a resource still tracking against the 47-minute baseline exceeds 150% of its published standard time with no acknowledged machine_events fault code explaining the delay; action: escalate_to_human; handoff: Production Supervisor"
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
| A live changeover on a resource still tracking against the 47-minute baseline exceeds 150% of its published standard time with no acknowledged machine_events fault code explaining the delay | escalate_to_human | Production Supervisor | An unexplained overrun that far past standard needs a supervisor on the floor to redeploy help immediately, not just a notification queued for the next review cycle. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
