---
type: Policy
title: Escalation policy 4
description: "When Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours; action: escalate_to_human; handoff: order_fallout_swat"
source_id: "escalation-4"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
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
| Enterprise-segment circuit order with fallout_status set and fallout age exceeding 72 hours | escalate_to_human | order_fallout_swat | Enterprise circuits carry contractual delivery SLAs with credits; fallout aging past 72 hours needs a named service delivery manager and a customer-facing jeopardy notice, not another automated retry. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
