---
type: Policy
title: Escalation policy 4
description: "When SPC run rule violation — 4 of 5 consecutive points beyond 1 sigma on the same side of center — on a CTQ characteristic; action: escalate_to_human; handoff: quality_engineer"
source_id: "escalation-4"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
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
| SPC run rule violation — 4 of 5 consecutive points beyond 1 sigma on the same side of center — on a CTQ characteristic | escalate_to_human | quality_engineer | A Western Electric zone B run signals a real process shift before parts go out of spec; the QE must decide on containment and re-centering while the material is still segregable. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
