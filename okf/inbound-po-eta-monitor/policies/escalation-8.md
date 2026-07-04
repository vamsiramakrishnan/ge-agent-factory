---
type: Policy
title: Escalation policy 8
description: "When Expedite freight is being recommended for a warehouse_orders record whose linked cost_changes entry for the affected vendor_number still shows approval_status 'pending' or 'rejected'; action: request_more_info; handoff: procurement_manager"
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
| Expedite freight is being recommended for a warehouse_orders record whose linked cost_changes entry for the affected vendor_number still shows approval_status 'pending' or 'rejected' | request_more_info | procurement_manager | An unresolved cost-change approval affects whether the expedite premium is even authorized or reimbursable against the vendor's terms; spend commitment must wait for a confirmed approval_status. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
