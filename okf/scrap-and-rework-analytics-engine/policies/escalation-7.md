---
type: Policy
title: Escalation policy 7
description: "When The same order_number shows two work_center_confirmations postings for a production_orders run within one scheduled_start window, with the second lacking a matching scrap_qty entry, consistent with reworked units re-entering under the original order; action: request_more_info; handoff: production_supervisor"
source_id: "escalation-7"
tags:
  - manufacturing
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
| The same order_number shows two work_center_confirmations postings for a production_orders run within one scheduled_start window, with the second lacking a matching scrap_qty entry, consistent with reworked units re-entering under the original order | request_more_info | production_supervisor | Duplicate yield postings under one order number could be a legitimate rework re-entry or a double-confirmation error, and only the supervisor confirming the physical routing can tell which; booking it wrong either way corrupts the scrap attribution. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
