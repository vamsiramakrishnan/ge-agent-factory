---
type: Policy
title: Escalation policy 7
description: "When Three or more open quotes from the same producer show FRISS network_link_indicators sharing a bank account or phone number within a rolling 30 days; action: escalate_to_human; handoff: SIU field investigator"
source_id: "escalation-7"
tags:
  - insurance
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
| Three or more open quotes from the same producer show FRISS network_link_indicators sharing a bank account or phone number within a rolling 30 days | escalate_to_human | SIU field investigator | Multi-quote producer clustering indicates a possible agency-level rate-evasion ring requiring licensed investigative work before any of the linked quotes are allowed to bind. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
