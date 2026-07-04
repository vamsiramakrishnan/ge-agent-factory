---
type: Policy
title: Escalation policy 7
description: "When Two nonconformance_records entries reference the same production_orders.order_number within a 48-hour window but carry different defect_code values; action: escalate_to_human; handoff: quality_engineer"
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
| Two nonconformance_records entries reference the same production_orders.order_number within a 48-hour window but carry different defect_code values | escalate_to_human | quality_engineer | Conflicting defect calls on the same order signal either a miscoded NC or a cascading process fault, and only engineering root-cause analysis can tell them apart before either ticket is dispositioned. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
