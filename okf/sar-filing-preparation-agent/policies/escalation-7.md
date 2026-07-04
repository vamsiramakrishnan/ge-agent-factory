---
type: Policy
title: Escalation policy 7
description: "When investigation_cases.filing_deadline_date is within 5 calendar days and the SAR narrative has not yet passed FinCEN field validation; action: escalate_to_human; handoff: BSA Officer"
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
| investigation_cases.filing_deadline_date is within 5 calendar days and the SAR narrative has not yet passed FinCEN field validation | escalate_to_human | BSA Officer | A narrative that has not cleared FinCEN field validation with the deadline this close risks a missed statutory filing; the BSA officer must expedite review or authorize a late-filing exception. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
