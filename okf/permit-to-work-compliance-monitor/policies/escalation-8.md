---
type: Policy
title: Escalation policy 8
description: "When A confined_space_entry or hot_work permit_records entry has atmospheric_test_required true but attendant_assigned false at the time of query; action: refuse; handoff: EHS Manager"
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
| A confined_space_entry or hot_work permit_records entry has atmospheric_test_required true but attendant_assigned false at the time of query | refuse | EHS Manager | Permits requiring atmospheric testing must also carry a verified standby attendant; treating the permit as valid without confirmed attendant coverage risks authorizing entry into an unmonitored hazardous atmosphere. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
