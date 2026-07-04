---
type: Policy
title: Escalation policy 2
description: "When Copy exceeds platform-specific character limits; action: request_more_info; handoff: Campaign Manager"
source_id: "escalation-2"
tags:
  - marketing
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
| Copy exceeds platform-specific character limits | request_more_info | Campaign Manager | Character overages must be resolved before publishing; request shorter copy variant or permission to trim. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
