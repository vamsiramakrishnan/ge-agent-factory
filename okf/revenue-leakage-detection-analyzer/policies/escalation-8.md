---
type: Policy
title: Escalation policy 8
description: "When rated_events for a subscriber_key remain at guiding_status = suspense with rerate_count already at the maximum of 3; action: request_more_info; handoff: mediation_operations"
source_id: "escalation-8"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| rated_events for a subscriber_key remain at guiding_status = suspense with rerate_count already at the maximum of 3 | request_more_info | mediation_operations | A subscriber that has exhausted the automated rerate allowance and is still unguided indicates a persistent mediation or rating-group defect that automated reprocessing cannot fix; the root cause must be diagnosed by mediation operations before the case is closed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
