---
type: Policy
title: Escalation policy 7
description: "When Borrower-reported most_recent_test_value for a minimum_dscr or minimum_tangible_net_worth covenant swings more than 25% from the prior test_frequency period without a corresponding credit_memo update to global_cash_flow or guarantor_strength; action: request_more_info; handoff: Relationship Manager"
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
| Borrower-reported most_recent_test_value for a minimum_dscr or minimum_tangible_net_worth covenant swings more than 25% from the prior test_frequency period without a corresponding credit_memo update to global_cash_flow or guarantor_strength | request_more_info | Relationship Manager | A large unexplained ratio swing likely reflects a data entry error, restated financials, or an unreported credit event and must be corroborated before the compliance_status is published. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
