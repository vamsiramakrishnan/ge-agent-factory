---
type: Policy
title: Escalation policy 7
description: "When A financial_accounts record's recomputed expected fee differs from the actual billed fee run in BigQuery analytics_events by more than 10 basis points or more than $500, and the account is scheduled for invoice release within 5 business days; action: escalate_to_human; handoff: Advisory Operations Manager"
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
| A financial_accounts record's recomputed expected fee differs from the actual billed fee run in BigQuery analytics_events by more than 10 basis points or more than $500, and the account is scheduled for invoice release within 5 business days | escalate_to_human | Advisory Operations Manager | Fee errors above this size and timing threshold cannot be corrected once invoices post, so they need manager sign-off before the fee run finalizes. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
