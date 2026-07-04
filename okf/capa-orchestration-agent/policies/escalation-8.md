---
type: Policy
title: Escalation policy 8
description: "When A newly opened capa_actions record shares defect_code and material_number with a capa_actions record closed within the last 90 days; action: request_more_info; handoff: Quality Engineer"
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
| A newly opened capa_actions record shares defect_code and material_number with a capa_actions record closed within the last 90 days | request_more_info | Quality Engineer | Recurrence within 90 days of closure is a strong signal the prior effectiveness check missed the true root cause and needs re-investigation, not a fresh independent CAPA cycle. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
