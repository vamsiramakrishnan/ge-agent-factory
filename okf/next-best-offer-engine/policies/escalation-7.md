---
type: Policy
title: Escalation policy 7
description: "When The decisioned audience's aggregate discount_amount exposure recorded in pos_transactions plus committed campaign_influence spend exceeds the channel's daily budget cap in the Loyalty Offer Margin & Liability Rate Card by more than 15%.; action: escalate_to_human; handoff: loyalty_finance_analyst"
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
| The decisioned audience's aggregate discount_amount exposure recorded in pos_transactions plus committed campaign_influence spend exceeds the channel's daily budget cap in the Loyalty Offer Margin & Liability Rate Card by more than 15%. | escalate_to_human | loyalty_finance_analyst | Budget breaches at that magnitude require finance sign-off before action_oracle_xstore_pos_publish commits spend the CRM team cannot claw back. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
