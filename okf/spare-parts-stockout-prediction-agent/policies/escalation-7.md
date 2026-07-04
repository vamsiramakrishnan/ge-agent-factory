---
type: Policy
title: Escalation policy 7
description: "When Recommended expedite purchase requisition exceeds $25,000 for a single line item or is sole-sourced to a vendor with risk_score = high; action: escalate_to_human; handoff: procurement_manager"
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
| Recommended expedite purchase requisition exceeds $25,000 for a single line item or is sole-sourced to a vendor with risk_score = high | escalate_to_human | procurement_manager | Expedite spend at that scale, or dependence on a high-risk vendor, needs procurement sign-off before the requisition is issued against SAP S/4HANA MM. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
