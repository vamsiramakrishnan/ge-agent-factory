---
type: Policy
title: Escalation policy 7
description: "When A claim posts three or more reserve_increase transactions in reserve_lines within a rolling 90-day window on the same claim_number; action: escalate_to_human; handoff: Reserve Committee / Actuarial liaison"
source_id: "escalation-7"
tags:
  - insurance
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
| A claim posts three or more reserve_increase transactions in reserve_lines within a rolling 90-day window on the same claim_number | escalate_to_human | Reserve Committee / Actuarial liaison | Repeated incremental increases distort IBNR loss-development triangles and signal the initial reserve was never adequately diagnosed; a single documented correction is required instead of continued stair-stepping, and actuarial must be notified before the next triangle close. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
