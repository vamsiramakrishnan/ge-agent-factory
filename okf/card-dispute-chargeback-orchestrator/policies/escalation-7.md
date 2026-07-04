---
type: Policy
title: Escalation policy 7
description: "When The network representment deadline computed from clearing_batches cutoff_date is within 3 calendar days and required merchant evidence has not been received via the linked ServiceNow ticket; action: escalate_to_human; handoff: Dispute Resolution Specialist Team Lead"
source_id: "escalation-7"
tags:
  - banking
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
| The network representment deadline computed from clearing_batches cutoff_date is within 3 calendar days and required merchant evidence has not been received via the linked ServiceNow ticket | escalate_to_human | Dispute Resolution Specialist Team Lead | A missed representment deadline results in an automatic write-off with no further recovery path, so near-expiry cases with an evidence gap must get a human decision on filing with partial evidence versus write-off. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
