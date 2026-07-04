---
type: Policy
title: Escalation policy 7
description: "When A single cashier's void-to-transaction ratio exceeds 8% over any rolling 7-day window on the same register; action: escalate_to_human; handoff: district_asset_protection_manager"
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
| A single cashier's void-to-transaction ratio exceeds 8% over any rolling 7-day window on the same register | escalate_to_human | district_asset_protection_manager | Sustained above-threshold void rates concentrated on one register are the leading indicator of sweethearting and warrant a covert AP investigation rather than a store-level coaching conversation. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
