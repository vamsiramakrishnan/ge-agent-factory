---
type: Policy
title: Escalation policy 7
description: "When Auto-remediation would touch a network_inventory_items element flagged under_support_contract = false or admin_state = decommission_pending; action: refuse; handoff: network_engineering"
source_id: "escalation-7"
tags:
  - telco
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
| Auto-remediation would touch a network_inventory_items element flagged under_support_contract = false or admin_state = decommission_pending | refuse | network_engineering | Replaying provisioning against unsupported or decommissioning network elements risks an unrecoverable outage; engineering must confirm a maintenance window and vendor support path before any retry runs. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
