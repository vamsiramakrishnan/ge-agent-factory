---
type: Policy
title: Escalation policy 8
description: "When On-hand quantity for a criticality_ranking = a_constraint part reaches zero with no open purchase_orders covering the gap and vendor lead time exceeds 14 days; action: escalate_to_human; handoff: MRO Storeroom Manager"
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
| On-hand quantity for a criticality_ranking = a_constraint part reaches zero with no open purchase_orders covering the gap and vendor lead time exceeds 14 days | escalate_to_human | MRO Storeroom Manager | A confirmed coverage gap on a constraint asset with no order in flight is an immediate downtime risk that needs a storeroom manager decision on expedite versus alternate sourcing. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
