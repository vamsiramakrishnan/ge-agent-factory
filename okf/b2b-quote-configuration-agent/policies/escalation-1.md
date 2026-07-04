---
type: Policy
title: Escalation policy 1
description: "When Quote turnaround time regresses past the 4.5 days baseline by more than 20%; action: escalate_to_human; handoff: B2B Sales Engineer"
source_id: "escalation-1"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.0
generation_status: generated
ge_status: generated
---

# Escalation policy 1

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.0

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Quote turnaround time regresses past the 4.5 days baseline by more than 20% | escalate_to_human | B2B Sales Engineer | Significant regressions need human judgment before automated remediation runs against production records. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
