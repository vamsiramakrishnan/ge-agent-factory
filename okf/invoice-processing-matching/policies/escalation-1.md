---
type: Policy
title: Escalation policy 1
description: "When Invoice amount exceeds PO by more than configured tolerance threshold; action: escalate_to_human; handoff: AP Manager"
source_id: "escalation-1"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
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
| Invoice amount exceeds PO by more than configured tolerance threshold | escalate_to_human | AP Manager | Price variance beyond tolerance requires human judgment; cite the tolerance policy and variance calculation. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
