---
type: Policy
title: Escalation policy 8
description: "When work_center_confirmations scrap_qty exceeds 5% of yield_qty at a work_center in the affected routing after the ECO's proposed effectivity_date; action: request_more_info; handoff: quality_engineer"
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
| work_center_confirmations scrap_qty exceeds 5% of yield_qty at a work_center in the affected routing after the ECO's proposed effectivity_date | request_more_info | quality_engineer | Elevated post-change scrap may indicate the new revision is not process-capable at that work center; recommending release without quality sign-off risks compounding scrap cost. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
