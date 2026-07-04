---
type: Policy
title: Escalation policy 4
description: "When Shrink variance exceeds 2% of sales in any store-week, or a single department posts a book-to-physical gap over $10k at inventory.; action: escalate_to_human; handoff: district_asset_protection_manager"
source_id: "escalation-4"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Shrink variance exceeds 2% of sales in any store-week, or a single department posts a book-to-physical gap over $10k at inventory. | escalate_to_human | district_asset_protection_manager | Variance at that level exceeds normal process shrink and requires AP investigation (receiving fraud, sweethearting, ORC) that must not be tipped off through routine store channels. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
