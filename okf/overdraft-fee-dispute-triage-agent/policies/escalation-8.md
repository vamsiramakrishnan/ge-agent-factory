---
type: Policy
title: Escalation policy 8
description: "When The disputed fee traces to a standing_orders retry (retry_on_insufficient_funds = true) that is the second or later consecutive NSF attempt for that order_reference; action: request_more_info; handoff: deposit_operations_specialist"
source_id: "escalation-8"
tags:
  - banking
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
| The disputed fee traces to a standing_orders retry (retry_on_insufficient_funds = true) that is the second or later consecutive NSF attempt for that order_reference | request_more_info | deposit_operations_specialist | Serial standing-order retries against an insufficient balance reflect a customer instruction choice the bank should surface and confirm, not silently keep re-charging or waiving without documented follow-up. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
