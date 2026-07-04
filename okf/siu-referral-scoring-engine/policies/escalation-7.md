---
type: Policy
title: Escalation policy 7
description: "When A claim_exposures record shows attorney_represented = true and demand_amount exceeds that exposure's reserve_amount by more than 3x while the linked siu_referrals.suspected_fraud_type is exaggerated_injury_buildup; action: escalate_to_human; handoff: SIU Investigator and defense counsel liaison"
source_id: "escalation-7"
tags:
  - insurance
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
| A claim_exposures record shows attorney_represented = true and demand_amount exceeds that exposure's reserve_amount by more than 3x while the linked siu_referrals.suspected_fraud_type is exaggerated_injury_buildup | escalate_to_human | SIU Investigator and defense counsel liaison | A demand-to-reserve gap this large under attorney representation carries both fraud and bad-faith exposure that require joint SIU/legal review before any position is communicated. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
