---
type: Policy
title: Escalation policy 8
description: "When Refreshed risk_reports return hazard_grade severe_referral_required, or refreshed mvr_records return worst_violation_36mo of dui_dwi, reckless_driving, or driving_while_suspended, for an account under requalification; action: escalate_to_human; handoff: Senior underwriter (referral desk)"
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
| Refreshed risk_reports return hazard_grade severe_referral_required, or refreshed mvr_records return worst_violation_36mo of dui_dwi, reckless_driving, or driving_while_suspended, for an account under requalification | escalate_to_human | Senior underwriter (referral desk) | Severe hazard findings or high-severity motor vehicle violations discovered during renewal requalification exceed field-level renewal authority and require a senior underwriter's documented referral decision before non-renew, re-rate, or renew-as-is is routed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
