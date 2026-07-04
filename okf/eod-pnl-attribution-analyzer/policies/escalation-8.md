---
type: Policy
title: Escalation policy 8
description: "When Fewer than 30 minutes remain before the 10am T+1 sign-off deadline and one or more desks still show unexplained P&L above threshold; action: request_more_info; handoff: Product Control Analyst"
source_id: "escalation-8"
tags:
  - banking
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
| Fewer than 30 minutes remain before the 10am T+1 sign-off deadline and one or more desks still show unexplained P&L above threshold | request_more_info | Product Control Analyst | A partial attribution pack must flag the outstanding desks explicitly rather than silently publish an incomplete sign-off against the deadline. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
