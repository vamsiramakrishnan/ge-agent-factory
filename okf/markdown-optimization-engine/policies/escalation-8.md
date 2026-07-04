---
type: Policy
title: Escalation policy 8
description: "When The recommended_retail in a price_recommendations record would sit below the new_unit_cost recorded in the most recent cost_changes record for that SKU.; action: request_more_info; handoff: merchandise_buyer"
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
| The recommended_retail in a price_recommendations record would sit below the new_unit_cost recorded in the most recent cost_changes record for that SKU. | request_more_info | merchandise_buyer | A markdown below the latest vendor cost update may reflect a cost_changes record not yet propagated to item_master; the buyer must confirm the effective cost before the recommendation can be finalized. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
