---
type: Policy
title: Escalation policy 8
description: "When A capa_actions record linked to a critical-severity nonconformance_records entry is still status=containment more than five days after detected_date with mrb_required=true; action: request_more_info; handoff: Material Review Board"
source_id: "escalation-8"
tags:
  - manufacturing
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
| A capa_actions record linked to a critical-severity nonconformance_records entry is still status=containment more than five days after detected_date with mrb_required=true | request_more_info | Material Review Board | An unresolved MRB-required containment past its normal window blocks any downstream release decision for the same material_number until the board records a disposition. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
