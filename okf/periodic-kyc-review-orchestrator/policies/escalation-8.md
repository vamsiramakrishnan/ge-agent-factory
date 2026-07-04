---
type: Policy
title: Escalation policy 8
description: "When screening_results.hit_type='pending_analyst_review' or disposition='pending' remains open at the moment the periodic review would otherwise be auto-completed; action: request_more_info; handoff: Screening/Sanctions Analyst"
source_id: "escalation-8"
tags:
  - banking
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
| screening_results.hit_type='pending_analyst_review' or disposition='pending' remains open at the moment the periodic review would otherwise be auto-completed | request_more_info | Screening/Sanctions Analyst | An unresolved screening disposition means the customer's current sanctions or PEP status is unknown; auto-completing the review would certify a profile that has not cleared screening. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
