---
type: Policy
title: Escalation policy 5
description: "When Creative performance data not available for platform; action: use_fallback_tool"
source_id: "escalation-5"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Creative performance data not available for platform | use_fallback_tool |  | Fall back to brand voice policy and historical cross-platform patterns if platform-specific data is missing. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
