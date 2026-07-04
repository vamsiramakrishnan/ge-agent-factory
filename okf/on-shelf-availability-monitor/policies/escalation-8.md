---
type: Policy
title: Escalation policy 8
description: "When The recovered-sales estimate attributed to OSA fixes at a single store exceeds 5x that store's trailing four-week average in a single week; action: request_more_info; handoff: district_operations_manager"
source_id: "escalation-8"
tags:
  - retail
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
| The recovered-sales estimate attributed to OSA fixes at a single store exceeds 5x that store's trailing four-week average in a single week | request_more_info | district_operations_manager | An outlier recovery estimate that large more likely reflects a sell-rate baseline or aggregation error than a genuine gap, and should be checked before it inflates the chain OSA scorecard. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
