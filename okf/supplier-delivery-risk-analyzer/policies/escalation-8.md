---
type: Policy
title: Escalation policy 8
description: "When A scenario_runs record backing a chase-list or safety-stock recommendation shows solver_status of infeasible or timeout; action: request_more_info; handoff: Materials Manager"
source_id: "escalation-8"
tags:
  - manufacturing
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
| A scenario_runs record backing a chase-list or safety-stock recommendation shows solver_status of infeasible or timeout | request_more_info | Materials Manager | An infeasible or timed-out solve cannot ground a safety-stock or chase-priority recommendation; a valid re-run is required before anything is published. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
