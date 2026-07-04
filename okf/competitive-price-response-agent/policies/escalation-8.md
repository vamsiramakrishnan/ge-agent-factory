---
type: Policy
title: Escalation policy 8
description: "When A price_zone_id's competitive_price_index falls outside the 0.85-1.18 tracked band while store_count for that zone exceeds 250.; action: escalate_to_human; handoff: divisional_merchandise_manager"
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
| A price_zone_id's competitive_price_index falls outside the 0.85-1.18 tracked band while store_count for that zone exceeds 250. | escalate_to_human | divisional_merchandise_manager | An out-of-band index across a large-footprint zone signals a systemic competitive or feed issue, not a single-SKU exception, and needs a zone-level pricing strategy decision. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
