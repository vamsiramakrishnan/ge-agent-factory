---
type: Policy
title: Escalation policy 8
description: "When cpk on any characteristic falls below 1.0 while a quality_checks record is being folded into quality-loss dollarization; action: escalate_to_human; handoff: process_engineer"
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
| cpk on any characteristic falls below 1.0 while a quality_checks record is being folded into quality-loss dollarization | escalate_to_human | process_engineer | A capability index below 1.0 indicates the process itself, not measurement noise, is at risk of producing out-of-spec parts; treating it as a routine quality-loss line item would understate the risk profile without engineering review. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
