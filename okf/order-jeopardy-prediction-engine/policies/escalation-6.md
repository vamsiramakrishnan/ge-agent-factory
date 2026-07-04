---
type: Policy
title: Escalation policy 6
description: "When Simple port-in still pending past the one-business-day FCC simple-port interval; action: escalate_to_human; handoff: lnp_operations_desk"
source_id: "escalation-6"
tags:
  - telco
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
| Simple port-in still pending past the one-business-day FCC simple-port interval | escalate_to_human | lnp_operations_desk | Ports beyond the mandated interval create regulatory exposure and are the leading driver of day-one churn on acquisition; the LNP desk owns inter-carrier escalation with the losing carrier. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
