---
type: Policy
title: Escalation policy 7
description: "When An account flagged dormant in core_accounts shows a customer-initiated account_transactions entry (non-fee, non-interest) posted after the classification date but before the escheatment filing deadline; action: request_more_info; handoff: Deposit Operations Analyst"
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
| An account flagged dormant in core_accounts shows a customer-initiated account_transactions entry (non-fee, non-interest) posted after the classification date but before the escheatment filing deadline | request_more_info | Deposit Operations Analyst | Post-classification customer activity resets the statutory dormancy clock and must be verified before the account is included in the escheatment filing package. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
