---
type: Policy
title: Escalation policy 5
description: "When Benefits Platform action returns status=failed or carrier_sync_id is null; action: escalate_to_human; handoff: Benefits operations"
source_id: "escalation-5"
tags:
  - hr
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
| Benefits Platform action returns status=failed or carrier_sync_id is null | escalate_to_human | Benefits operations | A failed carrier sync must be visible to a human; do not retry silently or claim success. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
