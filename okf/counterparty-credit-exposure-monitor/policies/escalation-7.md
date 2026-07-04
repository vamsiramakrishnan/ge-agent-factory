---
type: Policy
title: Escalation policy 7
description: "When A counterparty's 5-year CDS spread widens more than 100 basis points intraday, or its external rating is downgraded below investment grade (BBB-/Baa3), while trades or positions show rising notional exposure to that name; action: escalate_to_human; handoff: Counterparty Risk Manager"
source_id: "escalation-7"
tags:
  - banking
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
| A counterparty's 5-year CDS spread widens more than 100 basis points intraday, or its external rating is downgraded below investment grade (BBB-/Baa3), while trades or positions show rising notional exposure to that name | escalate_to_human | Counterparty Risk Manager | Rapid CDS widening or a sub-investment-grade downgrade is a classic wrong-way risk signal that can invalidate the current PFE assumptions driving credit line sizing, and warrants immediate review before further trades are booked to the name. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
