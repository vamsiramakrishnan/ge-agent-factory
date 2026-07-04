---
type: Policy
title: Escalation policy 8
description: "When an explore_queries follow-up ticket linked to a prior save offer on the same account_number is still status=pending past its logged verification window when the customer calls back to cancel; action: escalate_to_human; handoff: resolution_desk"
source_id: "escalation-8"
tags:
  - telco
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
| an explore_queries follow-up ticket linked to a prior save offer on the same account_number is still status=pending past its logged verification window when the customer calls back to cancel | escalate_to_human | resolution_desk | A broken promise-to-fix is a credibility failure a second discount cannot repair; a human owner must confirm remediation before any new offer is extended. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
