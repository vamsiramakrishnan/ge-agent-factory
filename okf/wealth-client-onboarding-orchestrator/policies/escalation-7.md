---
type: Policy
title: Escalation policy 7
description: "When An envelope tied to a financial_accounts record has been rejected as NIGO by the custodian more than twice within the same onboarding cycle; action: escalate_to_human; handoff: wealth_operations_manager"
source_id: "escalation-7"
tags:
  - banking
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
| An envelope tied to a financial_accounts record has been rejected as NIGO by the custodian more than twice within the same onboarding cycle | escalate_to_human | wealth_operations_manager | Repeat NIGO cycles beyond the runbook's cure SLA signal a structural documentation defect that automated resubmission cannot resolve, and further delay directly erodes the 4-day funding target. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
