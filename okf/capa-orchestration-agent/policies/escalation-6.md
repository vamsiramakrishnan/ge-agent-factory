---
type: Policy
title: Escalation policy 6
description: "When CAPA effectiveness check past due by more than 30 days; action: escalate_to_human; handoff: quality_director"
source_id: "escalation-6"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| CAPA effectiveness check past due by more than 30 days | escalate_to_human | quality_director | An overdue effectiveness check means the organization cannot demonstrate the corrective action worked — a standing major-finding risk at the next surveillance audit. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
