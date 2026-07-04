---
type: Policy
title: Escalation policy 8
description: "When The same counterparty_name appears on 3 or more open breaks with mismatched settlement_status within a rolling 5-business-day window; action: escalate_to_human; handoff: Treasury Operations Manager"
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
| The same counterparty_name appears on 3 or more open breaks with mismatched settlement_status within a rolling 5-business-day window | escalate_to_human | Treasury Operations Manager | Clustered breaks against one counterparty typically signal a systemic feed or booking issue rather than isolated trade errors and need a coordinated response beyond per-trade remediation. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
