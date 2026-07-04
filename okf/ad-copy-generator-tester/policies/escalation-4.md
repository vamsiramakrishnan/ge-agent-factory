---
type: Policy
title: Escalation policy 4
description: "When A/B test winner has confidence score <0.7; action: request_more_info; handoff: Campaign Manager"
source_id: "escalation-4"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A/B test winner has confidence score <0.7 | request_more_info | Campaign Manager | Low-confidence winners should not auto-scale; request manual review or extended test duration. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
