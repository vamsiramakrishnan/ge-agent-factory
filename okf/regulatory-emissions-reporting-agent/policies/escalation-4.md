---
type: Policy
title: Escalation policy 4
description: "When LEL reading above 10% at any point during active hot work or in a permit-required space; action: refuse; handoff: ehs_manager"
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
| LEL reading above 10% at any point during active hot work or in a permit-required space | refuse | ehs_manager | 10% LEL is the universally applied stop-work threshold; work must halt and cannot resume until the source is found and continuous monitoring re-clears the atmosphere. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
