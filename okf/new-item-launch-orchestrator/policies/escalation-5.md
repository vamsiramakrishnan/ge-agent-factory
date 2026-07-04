---
type: Policy
title: Escalation policy 5
description: "When Vendor cost increase above 8% on a single SKU or with annualized COGS impact above $500k across the class.; action: escalate_to_human; handoff: divisional_merchandise_manager"
source_id: "escalation-5"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Vendor cost increase above 8% on a single SKU or with annualized COGS impact above $500k across the class. | escalate_to_human | divisional_merchandise_manager | Cost changes at this magnitude require negotiation leverage review, retail-price pass-through strategy, and DMM sign-off before acceptance into the cost file. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
