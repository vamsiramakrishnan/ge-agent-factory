---
type: Policy
title: Escalation policy 5
description: "When Critical nonconformance detected on a lot already shipped or allocated to a customer order; action: escalate_to_human; handoff: quality_manager"
source_id: "escalation-5"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
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
| Critical nonconformance detected on a lot already shipped or allocated to a customer order | escalate_to_human | quality_manager | Escaped critical defects trigger customer notification, potential stop-ship or recall, and AS9100 clause 8.7 nonconforming-output obligations that carry contractual and liability weight. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
