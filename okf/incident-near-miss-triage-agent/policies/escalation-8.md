---
type: Policy
title: Escalation policy 8
description: "When osha_classification is submitted as near_miss or first_aid but injury_type is fracture, amputation, or foreign_body_eye, or days_away is greater than zero; action: request_more_info; handoff: reporting_supervisor"
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
| osha_classification is submitted as near_miss or first_aid but injury_type is fracture, amputation, or foreign_body_eye, or days_away is greater than zero | request_more_info | reporting_supervisor | A severe injury_type or nonzero days_away paired with a minor classification is very likely a miscode; auto-accepting it as low severity would misroute the case away from the OSHA-recordability review it actually needs. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
