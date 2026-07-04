---
type: Policy
title: Escalation policy 8
description: "When risk_reports.hazard_grade is severe_referral_required and open_recommendations is greater than 3 for a commercial_property or bop submission; action: escalate_to_human; handoff: Loss control engineering manager"
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
| risk_reports.hazard_grade is severe_referral_required and open_recommendations is greater than 3 for a commercial_property or bop submission | escalate_to_human | Loss control engineering manager | Severe hazard grades paired with multiple open loss-control recommendations exceed field-underwriter authority and require a loss-control engineering sign-off before any appetite determination is finalized. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
