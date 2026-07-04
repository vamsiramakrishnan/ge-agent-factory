---
type: Policy
title: Escalation policy 5
description: "When Recovery verification fails — metrics do not stabilize within 10 minutes post-action; action: escalate_to_human; handoff: SRE Manager"
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
| Recovery verification fails — metrics do not stabilize within 10 minutes post-action | escalate_to_human | SRE Manager | If remediation does not resolve the incident quickly, escalate for manual investigation. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
