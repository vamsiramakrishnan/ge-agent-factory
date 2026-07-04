---
type: Policy
title: Escalation policy 7
description: "When Recommended substitute material has no linked engineering equivalency approval and the affected demand_signals row is abc_class 'A'; action: request_more_info; handoff: manufacturing_engineer"
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
| Recommended substitute material has no linked engineering equivalency approval and the affected demand_signals row is abc_class 'A' | request_more_info | manufacturing_engineer | A-class demand feeds constrained lines; swapping materials without an approved equivalency record risks a functional failure that costs far more than the stockout it was meant to fix. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
