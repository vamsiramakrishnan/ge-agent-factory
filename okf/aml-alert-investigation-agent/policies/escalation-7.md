---
type: Policy
title: Escalation policy 7
description: "When investigation_cases.filing_deadline_date is within 3 calendar days and sar_decision is still 'pending_review'; action: escalate_to_human; handoff: BSA Officer"
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
| investigation_cases.filing_deadline_date is within 3 calendar days and sar_decision is still 'pending_review' | escalate_to_human | BSA Officer | The 30-day SAR filing clock cannot be extended by the agent; a case within 3 days of its deadline and still undecided needs BSA officer disposition, not further automated analysis. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
