---
type: Policy
title: Escalation policy 7
description: "When Computed last-time-buy quantity covers more than 5 years of remaining demand, or the affected part's vendor carries a risk_score of 'high' in the vendors entity; action: request_more_info; handoff: Procurement / Supply Chain Manager"
source_id: "escalation-7"
tags:
  - manufacturing
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
| Computed last-time-buy quantity covers more than 5 years of remaining demand, or the affected part's vendor carries a risk_score of 'high' in the vendors entity | request_more_info | Procurement / Supply Chain Manager | A high-risk vendor combined with a multi-year buy concentrates working capital and inventory-obsolescence exposure that a component engineer alone should not authorize. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
