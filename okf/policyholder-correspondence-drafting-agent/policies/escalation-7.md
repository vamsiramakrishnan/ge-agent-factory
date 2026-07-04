---
type: Policy
title: Escalation policy 7
description: "When A satisfaction_scores record tied to the same ticket thread shows two consecutive scores below 3 after a prior letter was already sent on that ticket; action: escalate_to_human; handoff: Customer Service Team Lead"
source_id: "escalation-7"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.6
generation_status: generated
ge_status: generated
---

# Escalation policy 7

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.6

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A satisfaction_scores record tied to the same ticket thread shows two consecutive scores below 3 after a prior letter was already sent on that ticket | escalate_to_human | Customer Service Team Lead | Repeated post-letter dissatisfaction signals a drafting quality problem, not a case for another automated attempt — the team lead must review and rewrite before a third letter goes out. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
