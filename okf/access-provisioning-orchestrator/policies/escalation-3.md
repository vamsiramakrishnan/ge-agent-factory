---
type: Policy
title: Escalation policy 3
description: "When Peer access pattern anomaly score > 0.8; action: request_more_info; handoff: Employee's manager"
source_id: "escalation-3"
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.2
generation_status: generated
ge_status: generated
---

# Escalation policy 3

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.2

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Peer access pattern anomaly score > 0.8 | request_more_info | Employee's manager | Peer enrichment uncovered an unusual access pattern; request manager confirmation before provisioning. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
