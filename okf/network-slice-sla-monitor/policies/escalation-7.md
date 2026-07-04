---
type: Policy
title: Escalation policy 7
description: "When Calculated SLA credit exposure for a single customer event exceeds $50,000, or the account crosses the chronic-breach threshold defined in the SLA Credit Schedule (3 or more confirmed breaches in a rolling quarter); action: escalate_to_human; handoff: enterprise_account_management"
source_id: "escalation-7"
tags:
  - telco
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
| Calculated SLA credit exposure for a single customer event exceeds $50,000, or the account crosses the chronic-breach threshold defined in the SLA Credit Schedule (3 or more confirmed breaches in a rolling quarter) | escalate_to_human | enterprise_account_management | Credit payouts of this size and chronic-breach determinations affect contract standing and the commercial relationship; account management must authorize before any credit is offered or termination-for-cause language is invoked. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
