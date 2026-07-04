---
type: Policy
title: Escalation policy 1
description: "When No available slot found within 5-day window for all panelists and candidate; action: escalate_to_human; handoff: Recruiting Coordinator"
source_id: "escalation-1"
tags:
  - hr
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
| No available slot found within 5-day window for all panelists and candidate | escalate_to_human | Recruiting Coordinator | Tight scheduling windows or high interviewer load require human judgment to extend window or defer interview. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
