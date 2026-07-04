---
type: Policy
title: Escalation policy 7
description: "When A pending_cancel_nonpay billing_accounts record has fewer than 3 calendar days remaining before its statutory notice deadline and the corresponding DocuSign recipients status has not reached delivered; action: escalate_to_human; handoff: Billing Supervisor"
source_id: "escalation-7"
tags:
  - insurance
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
| A pending_cancel_nonpay billing_accounts record has fewer than 3 calendar days remaining before its statutory notice deadline and the corresponding DocuSign recipients status has not reached delivered | escalate_to_human | Billing Supervisor | A notice that has not confirmed delivery this close to the deadline risks an unenforceable cancellation; a human must decide whether to re-dispatch or extend the hold before the window lapses. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
