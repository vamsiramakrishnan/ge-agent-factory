---
type: Policy
title: Escalation policy 8
description: "When Three consecutive publish cycles show the treatment group's offer redemption rate within 2 percentage points of the holdout cohort in analytics_events, indicating the model is not generating incremental lift.; action: request_more_info; handoff: CRM Manager"
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
| Three consecutive publish cycles show the treatment group's offer redemption rate within 2 percentage points of the holdout cohort in analytics_events, indicating the model is not generating incremental lift. | request_more_info | CRM Manager | Indistinguishable-from-holdout performance means the propensity model needs retraining or the offer catalog needs refresh before further budget is committed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
