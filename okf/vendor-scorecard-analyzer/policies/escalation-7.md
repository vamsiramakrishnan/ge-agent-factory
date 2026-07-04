---
type: Policy
title: Escalation policy 7
description: "When A compliance-claim packet requests chargeback recovery exceeding $50,000 against a single vendor_number in one filing; action: escalate_to_human; handoff: Vendor Performance Manager"
source_id: "escalation-7"
tags:
  - retail
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
| A compliance-claim packet requests chargeback recovery exceeding $50,000 against a single vendor_number in one filing | escalate_to_human | Vendor Performance Manager | Chargeback claims at this size affect the ongoing vendor negotiating relationship and require manager sign-off before the packet is transmitted to the vendor. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
