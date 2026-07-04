---
type: Policy
title: Escalation policy 7
description: "When prefill_datasets.fcra_adverse_action_triggered is true for a record used as evidence in an audit finding; action: escalate_to_human; handoff: Compliance / FCRA officer"
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
| prefill_datasets.fcra_adverse_action_triggered is true for a record used as evidence in an audit finding | escalate_to_human | Compliance / FCRA officer | FCRA requires an adverse-action notice and dispute path before consumer-report-derived data can support an underwriting or billing decision; the agent cannot self-certify that notice was given. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
