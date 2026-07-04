---
type: Policy
title: Escalation policy 2
description: "When Attribution confidence <0.6 (high model uncertainty); action: request_more_info"
source_id: "escalation-2"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.1
generation_status: generated
ge_status: generated
---

# Escalation policy 2

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.1

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Attribution confidence <0.6 (high model uncertainty) | request_more_info |  | Low confidence indicates insufficient data or modeling ambiguity; request clarification on model assumptions or data quality before publishing narrative. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
