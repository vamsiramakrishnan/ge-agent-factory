---
type: Policy
title: Escalation policy 8
description: "When A machine_events fault_alarm or e_stop on the same asset_number coincides with a quality_checks failure on the affected production_order within the same shift; action: request_more_info; handoff: Quality Engineer"
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
| A machine_events fault_alarm or e_stop on the same asset_number coincides with a quality_checks failure on the affected production_order within the same shift | request_more_info | Quality Engineer | A coincident fault alarm could be an equipment-induced excursion rather than true process drift; conflating the two would trigger an unnecessary lot hold or mask an unresolved maintenance issue, so the QE must review the machine-event context before any disposition is proposed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
