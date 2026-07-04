---
type: Policy
title: Escalation policy 8
description: "When investigation_cases.filing_deadline_date is within 5 calendar days and sar_decision is still pending_review; action: escalate_to_human; handoff: bsa_officer"
source_id: "escalation-8"
tags:
  - banking
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
| investigation_cases.filing_deadline_date is within 5 calendar days and sar_decision is still pending_review | escalate_to_human | bsa_officer | Missing the SAR filing deadline exposes the bank to regulatory enforcement action; the BSA officer must make the filing call before the deadline lapses, not the servicing layer. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
