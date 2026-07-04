---
type: Policy
title: Escalation policy 8
description: "When The lift decomposition assigns more than 50% of a promoted SKU's promo_lift_units to cannibalized or pulled-forward volume via cross_price_elasticity, effectively erasing net incremental lift; action: escalate_to_human; handoff: Promotions Manager"
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
| The lift decomposition assigns more than 50% of a promoted SKU's promo_lift_units to cannibalized or pulled-forward volume via cross_price_elasticity, effectively erasing net incremental lift | escalate_to_human | Promotions Manager | Near-zero net incremental lift calls the promotion's ROI into question and needs a manager's go/no-go before the scorecard is published as a repeatedly unprofitable event type. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
