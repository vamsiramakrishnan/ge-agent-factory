---
type: Policy
title: Escalation policy 2
description: "When Source-system evidence is incomplete or stale (>24h) for any required entity; action: request_more_info"
source_id: "escalation-2"
tags:
  - hr
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
| Source-system evidence is incomplete or stale (>24h) for any required entity | request_more_info |  | Recommendations grounded in stale evidence misrepresent current state and undermine audit defensibility. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
