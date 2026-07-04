---
type: Policy
title: Escalation policy 7
description: "When Two elasticity_models records for the same sku and price_zone_id disagree in the sign of own_price_elasticity for a kvi_flag=true item, yielding contradictory respond/hold recommendations.; action: escalate_to_human; handoff: senior_pricing_analyst"
source_id: "escalation-7"
tags:
  - retail
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
| Two elasticity_models records for the same sku and price_zone_id disagree in the sign of own_price_elasticity for a kvi_flag=true item, yielding contradictory respond/hold recommendations. | escalate_to_human | senior_pricing_analyst | Sign-conflicting elasticity reads on a known-value item mean at least one model input is unreliable; auto-selecting either recommendation risks mispricing a KVI against the tracked competitive set. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
