---
type: Policy
title: Escalation policy 7
description: "When An originator's trailing-60-day unauthorized return rate (R05/R07/R10/R11/R29 combined) meets or exceeds the Nacha 0.5% threshold, or its overall return rate meets or exceeds 15%; action: escalate_to_human; handoff: originator_relationship_manager"
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
| An originator's trailing-60-day unauthorized return rate (R05/R07/R10/R11/R29 combined) meets or exceeds the Nacha 0.5% threshold, or its overall return rate meets or exceeds 15% | escalate_to_human | originator_relationship_manager | Nacha requires the ODFI to notify the originator and track a formal risk mitigation plan once a threshold is met; only the relationship manager holds authority to negotiate remediation terms directly with the originator. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
