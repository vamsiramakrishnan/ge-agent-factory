---
type: Policy
title: Escalation policy 8
description: "When DocuSign envelope for the settlement release or lien payoff letter has drawn no recipient action for more than 48 hours; action: escalate_to_human; handoff: Auto Claims Specialist"
source_id: "escalation-8"
tags:
  - insurance
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
| DocuSign envelope for the settlement release or lien payoff letter has drawn no recipient action for more than 48 hours | escalate_to_human | Auto Claims Specialist | Stalled e-signature files are the primary driver of rental reimbursement overspend and must be worked before the $280-per-total-loss rental KPI target is put at risk. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
