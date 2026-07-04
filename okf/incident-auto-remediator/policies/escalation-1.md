---
type: Policy
title: Escalation policy 1
description: "When Incident severity is Sev-1 (critical production outage); action: escalate_to_human; handoff: SRE Manager + on-call lead"
source_id: "escalation-1"
tags:
  - it
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
| Incident severity is Sev-1 (critical production outage) | escalate_to_human | SRE Manager + on-call lead | Sev-1 incidents require immediate human oversight and approval before any remediation action. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
