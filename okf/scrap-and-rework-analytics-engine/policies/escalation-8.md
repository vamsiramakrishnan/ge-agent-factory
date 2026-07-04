---
type: Policy
title: Escalation policy 8
description: "When A nightly BigQuery join finds a production_orders.scrap_qty with no matching SAP S/4HANA PP work_center_confirmations record for the same order_number more than 24 hours past shift close; action: request_more_info; handoff: Plant Controller"
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
| A nightly BigQuery join finds a production_orders.scrap_qty with no matching SAP S/4HANA PP work_center_confirmations record for the same order_number more than 24 hours past shift close | request_more_info | Plant Controller | Attribution to machine, shift, and operator cannot be trusted without a matching confirmation record, and publishing dashboard cost figures built on unmatched scrap misleads the month-end variance review. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
