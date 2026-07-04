---
type: Policy
title: Escalation policy 7
description: "When battery_runtime_hours for a site with an active, uncleared power_failure alarm drops below 4 hours and backhaul_type is microwave or legacy_tdm (no diverse path); action: escalate_to_human; handoff: field_operations_dispatch"
source_id: "escalation-7"
tags:
  - telco
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
| battery_runtime_hours for a site with an active, uncleared power_failure alarm drops below 4 hours and backhaul_type is microwave or legacy_tdm (no diverse path) | escalate_to_human | field_operations_dispatch | Single-homed backhaul combined with draining battery reserve means the site will go fully dark before a scheduled truck roll — dispatch prioritization needs a human call, not an automated ticket in the standard queue. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
