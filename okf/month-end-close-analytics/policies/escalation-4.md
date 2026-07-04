---
type: Policy
title: Escalation policy 4
description: "When Cycle target_days metric is missing or zero in the baseline data; action: request_more_info"
source_id: "escalation-4"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Cycle target_days metric is missing or zero in the baseline data | request_more_info |  | Trend analysis requires a documented target; ask the controller to confirm the target close cycle time (e.g., 8 business days) before computing variance. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
