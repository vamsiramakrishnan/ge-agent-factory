---
type: Policy
title: Escalation policy 8
description: "When Trailing-30-day LP investigation hit rate for any store cluster falls below 30% against the 61% target; action: request_more_info; handoff: Loss Prevention Manager"
source_id: "escalation-8"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Trailing-30-day LP investigation hit rate for any store cluster falls below 30% against the 61% target | request_more_info | Loss Prevention Manager | A hit-rate collapse signals the scoring model or baseline data may be miscalibrated for that cluster and needs manager review before more field cases are dispatched. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
