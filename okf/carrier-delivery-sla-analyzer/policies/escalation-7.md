---
type: Policy
title: Escalation policy 7
description: "When A single carrier's open dispute-claim backlog exceeds 15 claims older than 30 days, or aggregate disputed invoice dollars for that carrier exceed $25,000 in the trailing month.; action: escalate_to_human; handoff: carrier_relationship_manager"
source_id: "escalation-7"
tags:
  - retail
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
| A single carrier's open dispute-claim backlog exceeds 15 claims older than 30 days, or aggregate disputed invoice dollars for that carrier exceed $25,000 in the trailing month. | escalate_to_human | carrier_relationship_manager | Concentrated, aging disputes signal a carrier relationship or contract-interpretation problem that needs commercial escalation, not another automated claim filing. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
