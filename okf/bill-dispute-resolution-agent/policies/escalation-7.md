---
type: Policy
title: Escalation policy 7
description: "When The same billing_accounts.account_number generates a third Zendesk dispute ticket within a rolling 90-day window citing the same rate_plan_code; action: escalate_to_human; handoff: billing configuration analyst"
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
| The same billing_accounts.account_number generates a third Zendesk dispute ticket within a rolling 90-day window citing the same rate_plan_code | escalate_to_human | billing configuration analyst | Three disputes on the same account and rate plan in 90 days is a repeat-dispute signature of a systemic rating or proration misconfiguration, not a series of unrelated one-off errors, and needs a root-cause fix ticket rather than another discrete credit. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
