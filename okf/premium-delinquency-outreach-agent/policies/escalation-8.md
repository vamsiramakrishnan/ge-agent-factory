---
type: Policy
title: Escalation policy 8
description: "When A billing_accounts record scores in the bottom cure-probability decile and its past_due_amount exceeds $2,500; action: escalate_to_human; handoff: Billing Operations Analyst"
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
| A billing_accounts record scores in the bottom cure-probability decile and its past_due_amount exceeds $2,500 | escalate_to_human | Billing Operations Analyst | High-premium accounts unlikely to self-cure need a human-suggested payment arrangement rather than another automated reminder, per the agent's designed escalation scope. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
