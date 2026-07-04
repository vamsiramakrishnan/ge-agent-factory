---
type: Policy
title: Escalation policy 7
description: "When An item_master SKU shows item_status of clearance or discontinued with weeks_of_supply above 20 and no markdown_cadence deeper than second_markdown_40 has been applied in the current price_recommendations record.; action: escalate_to_human; handoff: Pricing Analyst"
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
| An item_master SKU shows item_status of clearance or discontinued with weeks_of_supply above 20 and no markdown_cadence deeper than second_markdown_40 has been applied in the current price_recommendations record. | escalate_to_human | Pricing Analyst | Aging clearance or discontinued SKUs approaching the clearance-exit window need a human cadence decision before space-reclamation forces a deeper markdown at a worse margin. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
