---
type: Policy
title: Escalation policy 8
description: "When A capa_actions corrective action linked to a currently open nonconformance_records entry is more than 15 days past its due_date with effectiveness_verified still false; action: escalate_to_human; handoff: quality_manager"
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
| A capa_actions corrective action linked to a currently open nonconformance_records entry is more than 15 days past its due_date with effectiveness_verified still false | escalate_to_human | quality_manager | An overdue, unverified corrective action tied to a still-open NC means the underlying cause was never actually fixed, so continuing to triage new NCs against it risks repeat escapes. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
