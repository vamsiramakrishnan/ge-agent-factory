---
type: Policy
title: Escalation policy 7
description: "When A collateral perfection exception (UCC filing or insurance endorsement) on covenant_records or credit_memos remains open more than 45 days past the credit_memo's memo_date on a credit with risk_rating of 6 or worse in loan_applications; action: escalate_to_human; handoff: Collateral Perfection Manager"
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
| A collateral perfection exception (UCC filing or insurance endorsement) on covenant_records or credit_memos remains open more than 45 days past the credit_memo's memo_date on a credit with risk_rating of 6 or worse in loan_applications | escalate_to_human | Collateral Perfection Manager | Aged perfection gaps on classified credits are the exact exam finding this agent exists to eliminate; the cure path must be independently reviewed rather than left in the automated queue. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
