---
type: Policy
title: Escalation policy 7
description: "When A tender_records entry has offline_authorization_flag=true and tender_amount exceeds the card network's floor limit documented in the EMV Fallback & Offline Authorization Risk Bulletin; action: escalate_to_human; handoff: loss_prevention_manager"
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
| A tender_records entry has offline_authorization_flag=true and tender_amount exceeds the card network's floor limit documented in the EMV Fallback & Offline Authorization Risk Bulletin | escalate_to_human | loss_prevention_manager | Fallback authorizations above the floor limit carry chargeback liability that only a risk-trained manager can accept, and doing so without sign-off exposes the store to uncollectible losses. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
