---
type: Policy
title: Escalation policy 5
description: "When credit_check_status is declined or deposit_required and the seller requests an override to close the sale; action: refuse; handoff: credit_risk_operations"
source_id: "escalation-5"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| credit_check_status is declined or deposit_required and the seller requests an override to close the sale | refuse | credit_risk_operations | Credit decisions are a risk-policy control, not a sales negotiable; overrides go through credit risk with documented justification, never through the selling channel. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
