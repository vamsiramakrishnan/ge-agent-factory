---
type: Policy
title: Escalation policy 7
description: "When A promo event's analytics_events variance_pct against the historical_metrics baseline remains unresolved, with no corroborating store_shift_summaries or pos_transactions evidence, more than 24 hours after the event's first business day; action: escalate_to_human; handoff: regional_visual_merchandising_manager"
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
| A promo event's analytics_events variance_pct against the historical_metrics baseline remains unresolved, with no corroborating store_shift_summaries or pos_transactions evidence, more than 24 hours after the event's first business day | escalate_to_human | regional_visual_merchandising_manager | Unverified promo setups are exactly the failure mode behind the Promo setup verification rate KPI; leaving them open past the event's first weekend risks a sales miss before anyone catches the gap. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
