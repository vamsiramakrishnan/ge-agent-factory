---
type: Policy
title: Escalation policy 8
description: "When Two as-built submissions for the same premise_id disagree on plant-of-record details (e.g., splice enclosure location, drop length) across separate field_work_orders visits; action: request_more_info; handoff: field_quality_supervisor"
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
| Two as-built submissions for the same premise_id disagree on plant-of-record details (e.g., splice enclosure location, drop length) across separate field_work_orders visits | request_more_info | field_quality_supervisor | Conflicting as-built records for one premise mean the network inventory of record cannot be safely updated until the discrepancy is reconciled with the technicians who worked each visit. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
