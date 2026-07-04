---
type: Policy
title: Escalation policy 5
description: "When Termination event without revocation window compliance check; action: escalate_to_human; handoff: Compliance officer"
source_id: "escalation-5"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Termination event without revocation window compliance check | escalate_to_human | Compliance officer | Termination revocation must complete within the policy window; escalate to compliance for enforcement. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
