---
type: Policy
title: Escalation policy 6
description: "When Uncollateralized mark-to-market exposure to a derivatives counterparty exceeds the CSA threshold, or a margin call remains unmet past the standard settlement cycle; action: escalate_to_human; handoff: counterparty_credit_risk_officer"
source_id: "escalation-6"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Uncollateralized mark-to-market exposure to a derivatives counterparty exceeds the CSA threshold, or a margin call remains unmet past the standard settlement cycle | escalate_to_human | counterparty_credit_risk_officer | An unmet margin call is an event-of-default precursor under the ISDA Master Agreement; close-out netting decisions and default notices are legal and credit determinations, not desk-level judgment calls. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
