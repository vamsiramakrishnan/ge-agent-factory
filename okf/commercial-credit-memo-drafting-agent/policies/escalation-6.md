---
type: Policy
title: Escalation policy 6
description: "When Financial covenant reported as breached and not cured or formally waived within 30 days of the test date; action: escalate_to_human; handoff: special_assets_group"
source_id: "escalation-6"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Financial covenant reported as breached and not cured or formally waived within 30 days of the test date | escalate_to_human | special_assets_group | An uncured covenant breach triggers risk-rating migration review and possible nonaccrual/TDR-successor (loan modification) accounting treatment; workout strategy is outside origination authority. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
