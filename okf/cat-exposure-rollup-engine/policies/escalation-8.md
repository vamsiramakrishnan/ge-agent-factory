---
type: Policy
title: Escalation policy 8
description: "When Daily-rollup 100-year PML diverges from the last vendor cat-model output by more than the ±5% target tolerance for two consecutive refresh cycles; action: request_more_info; handoff: Cat Modeling Actuary"
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
| Daily-rollup 100-year PML diverges from the last vendor cat-model output by more than the ±5% target tolerance for two consecutive refresh cycles | request_more_info | Cat Modeling Actuary | Persistent PML divergence from the modeled baseline signals a data or model-input defect that must be diagnosed before the figure is published to dashboards or reinsurers. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
