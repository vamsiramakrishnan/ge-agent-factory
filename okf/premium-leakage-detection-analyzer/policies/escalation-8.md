---
type: Policy
title: Escalation policy 8
description: "When risk_reports.hazard_grade is 'severe_referral_required' for any policy in the current audit queue; action: escalate_to_human; handoff: Premium Audit Manager"
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
| risk_reports.hazard_grade is 'severe_referral_required' for any policy in the current audit queue | escalate_to_human | Premium Audit Manager | A severe hazard grade signals a condition the inspection vendor already flagged for mandatory referral; the agent should surface it for manager disposition rather than scoring it into the routine leakage queue. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
