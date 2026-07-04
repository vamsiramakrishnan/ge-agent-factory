---
type: Policy
title: Escalation policy 7
description: "When prefill_datasets.fcra_adverse_action_triggered is true for a submission where underwriting_tier assignment relies on the insurance_score; action: request_more_info; handoff: Underwriter"
source_id: "escalation-7"
tags:
  - insurance
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
| prefill_datasets.fcra_adverse_action_triggered is true for a submission where underwriting_tier assignment relies on the insurance_score | request_more_info | Underwriter | FCRA requires a compliant adverse-action notice process before insurance_score can be used to tier or decline the risk, so scoring must pause until the notice workflow is confirmed. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
