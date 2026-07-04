---
type: Policy
title: Escalation policy 8
description: "When Failure-mode clustering assigns more than 30% of an asset's work orders to a failure_mode not previously observed on that asset_class in the historical baseline; action: escalate_to_human; handoff: Reliability Engineer"
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
| Failure-mode clustering assigns more than 30% of an asset's work orders to a failure_mode not previously observed on that asset_class in the historical baseline | escalate_to_human | Reliability Engineer | An unfamiliar failure signature on a known asset class can indicate a misapplied replacement part, an operating-condition change, or a data-entry error, any of which needs engineering judgment rather than an automated defect-elimination recommendation. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
