---
type: Policy
title: Escalation policy 8
description: "When battery_runtime_hours on any impacted cell_sites row is below 4 hours while the restoration crew's estimated arrival exceeds that remaining runtime; action: escalate_to_human; handoff: noc_tier3_incident_commander"
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
| battery_runtime_hours on any impacted cell_sites row is below 4 hours while the restoration crew's estimated arrival exceeds that remaining runtime | escalate_to_human | noc_tier3_incident_commander | Sites will go dark before backup power arrives without an emergency generator dispatch; this converts the job from a fiber repair into a power-continuity emergency needing incident-commander-level resource allocation, not routine crew tracking. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
