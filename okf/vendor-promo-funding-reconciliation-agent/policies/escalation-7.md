---
type: Policy
title: Escalation policy 7
description: "When A single vendor's cumulative disputed or short-paid claim amount across open deals exceeds $250,000 or 15% of that vendor's total committed funding for the quarter; action: escalate_to_human; handoff: Vendor Compliance Manager"
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
| A single vendor's cumulative disputed or short-paid claim amount across open deals exceeds $250,000 or 15% of that vendor's total committed funding for the quarter | escalate_to_human | Vendor Compliance Manager | Disputes at that scale usually reflect a contract-interpretation disagreement rather than a documentation gap, and only Vendor Compliance holds the authority to renegotiate deal terms or place a vendor on hold. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
