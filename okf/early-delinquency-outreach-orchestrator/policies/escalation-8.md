---
type: Policy
title: Escalation policy 8
description: "When The BigQuery-derived cure-probability segmentation disagrees with the collector's logged promise-to-pay status in tickets by more than one priority tier (e.g., an account scored high-risk for immediate outreach while tickets shows an active, unbroken kept promise); action: request_more_info; handoff: Collections Supervisor"
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
| The BigQuery-derived cure-probability segmentation disagrees with the collector's logged promise-to-pay status in tickets by more than one priority tier (e.g., an account scored high-risk for immediate outreach while tickets shows an active, unbroken kept promise) | request_more_info | Collections Supervisor | Conflicting evidence between the analytics-derived score and the ServiceNow promise-to-pay record must be reconciled before worklist assignment to avoid duplicate contact and avoidable borrower complaints. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
