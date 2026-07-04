---
type: Policy
title: Escalation policy 8
description: "When cost_changes shows an approval_status of 'pending' for a SKU that is simultaneously flagged for swap or delist in the current ranking pass; action: escalate_to_human; handoff: Category Manager"
source_id: "escalation-8"
tags:
  - retail
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
| cost_changes shows an approval_status of 'pending' for a SKU that is simultaneously flagged for swap or delist in the current ranking pass | escalate_to_human | Category Manager | Ranking a SKU on an unapproved cost record risks publishing a keep/delist deck built on a margin figure that has not cleared vendor negotiation, undermining the deck's audit defensibility at line review. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
