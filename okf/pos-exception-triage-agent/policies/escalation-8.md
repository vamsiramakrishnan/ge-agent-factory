---
type: Policy
title: Escalation policy 8
description: "When Three or more Zendesk tickets are opened against the same store_number and register_number within a rolling 24-hour window; action: escalate_to_human; handoff: regional_it_field_technician"
source_id: "escalation-8"
tags:
  - retail
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
| Three or more Zendesk tickets are opened against the same store_number and register_number within a rolling 24-hour window | escalate_to_human | regional_it_field_technician | Repeated same-register tickets within a day indicate a hardware fault a remote macro cannot fix, and continued remote triage only extends register downtime. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
