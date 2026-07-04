---
type: Policy
title: Escalation policy 7
description: "When A billed CPT/HCPCS line item on a workers_comp claim exceeds the jurisdiction_state fee schedule allowable by more than 300% or lacks a matching authorized treatment guideline citation; action: escalate_to_human; handoff: Utilization review (UR) physician"
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
| A billed CPT/HCPCS line item on a workers_comp claim exceeds the jurisdiction_state fee schedule allowable by more than 300% or lacks a matching authorized treatment guideline citation | escalate_to_human | Utilization review (UR) physician | Only a licensed UR physician can make a medical-necessity or fee-schedule-exception determination; adjusters may not override clinical coding disputes. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
