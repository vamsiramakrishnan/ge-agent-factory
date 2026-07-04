---
type: Policy
title: Escalation policy 8
description: "When A recommended counter-play requires a match discount that would push discount_pct past the Discount Authority Matrix's segment ceiling; action: escalate_to_human; handoff: sales_pricing_desk"
source_id: "escalation-8"
tags:
  - telco
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
| A recommended counter-play requires a match discount that would push discount_pct past the Discount Authority Matrix's segment ceiling | escalate_to_human | sales_pricing_desk | Counter-play pricing that exceeds the delegated discount ceiling changes deal economics and requires deal-desk margin review, not analyst-level sign-off. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
