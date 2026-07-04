---
type: Policy
title: Escalation policy 8
description: "When The circular_updates record governing the current filing period shows carrier_adoption_status 'under_actuarial_review' while insurance_3_records still reflects the prior filing's trend selection as adopted; action: request_more_info; handoff: Filing coordinator"
source_id: "escalation-8"
tags:
  - insurance
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
| The circular_updates record governing the current filing period shows carrier_adoption_status 'under_actuarial_review' while insurance_3_records still reflects the prior filing's trend selection as adopted | request_more_info | Filing coordinator | Filing before the adoption decision is finalized risks submitting an indication built on a loss cost basis the company has not actually adopted. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
