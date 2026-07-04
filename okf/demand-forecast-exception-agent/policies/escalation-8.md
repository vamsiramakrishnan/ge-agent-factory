---
type: Policy
title: Escalation policy 8
description: "When seasonal_profiles.post_peak_cliff_flag is true for the merchandise class and the recommended forecast_overrides row extends elevated units beyond peak_week plus build_weeks; action: request_more_info; handoff: Senior Demand Planner"
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
| seasonal_profiles.post_peak_cliff_flag is true for the merchandise class and the recommended forecast_overrides row extends elevated units beyond peak_week plus build_weeks | request_more_info | Senior Demand Planner | Extending elevated demand past the modeled cliff window risks stranding inventory post-peak; needs a category-level read before the override is finalized. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
