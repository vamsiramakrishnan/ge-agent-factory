---
type: Policy
title: Escalation policy 8
description: "When advisory_referrals.suitability_status is determined_unsuitable but the linked financial_accounts show market_value growth concentrated in that referral's product_interest category within the trailing quarter; action: escalate_to_human; handoff: Wealth Compliance Officer"
source_id: "escalation-8"
tags:
  - banking
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
| advisory_referrals.suitability_status is determined_unsuitable but the linked financial_accounts show market_value growth concentrated in that referral's product_interest category within the trailing quarter | escalate_to_human | Wealth Compliance Officer | Growth in a product already determined unsuitable suggests possible unauthorized execution and requires immediate review of the trade blotter and advisor conduct. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
