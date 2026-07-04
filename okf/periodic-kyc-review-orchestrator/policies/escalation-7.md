---
type: Policy
title: Escalation policy 7
description: "When A case with cdd_risk_rating='high' or edd_required=true has next_review_date more than 30 days in the past; action: escalate_to_human; handoff: Senior KYC Analyst"
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
| A case with cdd_risk_rating='high' or edd_required=true has next_review_date more than 30 days in the past | escalate_to_human | Senior KYC Analyst | High-risk relationships overdue on periodic review are the top examiner finding against risk-based CDD programs and cannot be auto-completed by the agent. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
