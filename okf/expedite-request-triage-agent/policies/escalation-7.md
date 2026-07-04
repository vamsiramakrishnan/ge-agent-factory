---
type: Policy
title: Escalation policy 7
description: "When Requested expedite premium exceeds the rate schedule's tier ceiling for the vendor's risk_score band by more than 15%; action: escalate_to_human; handoff: procurement_director"
source_id: "escalation-7"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.6
generation_status: generated
ge_status: generated
---

# Escalation policy 7

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.6

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Requested expedite premium exceeds the rate schedule's tier ceiling for the vendor's risk_score band by more than 15% | escalate_to_human | procurement_director | Rate-schedule tier ceilings are a delegated cost-authority limit; breaching them by a material margin requires director sign-off before any commitment is made to the vendor. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
