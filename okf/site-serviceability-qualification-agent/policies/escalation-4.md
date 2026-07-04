---
type: Policy
title: Escalation policy 4
description: "When Requested discount exceeds 20% off rate card, or any non-standard MRR concession on a term deal; action: escalate_to_human; handoff: sales_pricing_desk"
source_id: "escalation-4"
tags:
  - telco
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
| Requested discount exceeds 20% off rate card, or any non-standard MRR concession on a term deal | escalate_to_human | sales_pricing_desk | Discounts above the published delegation-of-authority band require deal-desk margin review; unlogged concessions are the top source of quote-to-bill mismatch downstream. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
