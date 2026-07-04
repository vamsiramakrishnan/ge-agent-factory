---
type: Policy
title: Escalation policy 7
description: "When A promo event closes and the post-event scorecard cannot be generated within the 72-hour SLA because demand_forecasts.frozen_period_flag is true for the affected sku/store weeks; action: request_more_info; handoff: demand planning lead"
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
| A promo event closes and the post-event scorecard cannot be generated within the 72-hour SLA because demand_forecasts.frozen_period_flag is true for the affected sku/store weeks | request_more_info | demand planning lead | Frozen forecast periods block automatic re-forecast and lift decomposition; a manual unlock decision is required before the scorecard can be assembled and published. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
