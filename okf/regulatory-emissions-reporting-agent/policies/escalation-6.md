---
type: Policy
title: Escalation policy 6
description: "When Any fatality, inpatient hospitalization, amputation, or loss of an eye; action: escalate_to_human; handoff: site_leader"
source_id: "escalation-6"
tags:
  - manufacturing
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
| Any fatality, inpatient hospitalization, amputation, or loss of an eye | escalate_to_human | site_leader | OSHA requires fatality reporting within 8 hours and hospitalization/amputation/eye-loss within 24; site leadership owns the report, scene preservation, and family/agency communication. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
