---
type: Policy
title: Escalation policy 2
description: "When No runbook match found or matched runbooks have success_rate <50%; action: escalate_to_human; handoff: SRE Manager"
source_id: "escalation-2"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.1
generation_status: generated
ge_status: generated
---

# Escalation policy 2

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.1

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| No runbook match found or matched runbooks have success_rate <50% | escalate_to_human | SRE Manager | Low-confidence remediation must be escalated rather than auto-executed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
