---
type: Policy
title: Escalation policy 1
description: "When Generated copy contains brand voice rule violation (must_avoid clause); action: refuse"
source_id: "escalation-1"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.0
generation_status: generated
ge_status: generated
---

# Escalation policy 1

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.0

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Generated copy contains brand voice rule violation (must_avoid clause) | refuse |  | Brand voice violations must never be published; cite brand_voice_rules and ask agent to regenerate copy. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
