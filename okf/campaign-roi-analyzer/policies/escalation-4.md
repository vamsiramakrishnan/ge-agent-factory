---
type: Policy
title: Escalation policy 4
description: "When Recommended budget reallocations conflict with locked annual budget or committed spend; action: refuse"
source_id: "escalation-4"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Recommended budget reallocations conflict with locked annual budget or committed spend | refuse |  | Never recommend reallocations that violate signed annual commitments; escalate to CMO if conflict cannot be resolved through governance policy. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
