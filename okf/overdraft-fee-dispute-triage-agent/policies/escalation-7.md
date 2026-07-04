---
type: Policy
title: Escalation policy 7
description: "When A ServiceNow tickets record references three or more overdraft-fee disputes on the same core_accounts account_number within a rolling 30-day account_transactions window; action: escalate_to_human; handoff: retail_banking_service_manager"
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
| A ServiceNow tickets record references three or more overdraft-fee disputes on the same core_accounts account_number within a rolling 30-day account_transactions window | escalate_to_human | retail_banking_service_manager | Repeated fee triggers on one account inside 30 days indicate either a chronic low-balance servicing issue or a fee-farming pattern that the waiver matrix requires a service manager to review holistically rather than fee-by-fee. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
