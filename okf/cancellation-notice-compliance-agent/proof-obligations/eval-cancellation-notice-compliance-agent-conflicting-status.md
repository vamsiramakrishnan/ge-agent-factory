---
type: Proof Obligation
title: "Golden eval obligation — Billing account BAC-100482 (policy PLC-778821) shows account_status = pending_cancel_nonpay with a past_due_amount of $612.40, but premium_invoices record INV-55931 for that same billing_account_number is marked invoice_status = paid_in_full as of 2026-06-29. Before we cut a cancellation notice, tell me whether this account is still eligible for nonpay cancellation and what the correct statutory notice date is."
description: golden eval proof obligation
source_id: "eval-cancellation-notice-compliance-agent-conflicting-status"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Billing account BAC-100482 (policy PLC-778821) shows account_status = pending_cancel_nonpay with a past_due_amount of $612.40, but premium_invoices record INV-55931 for that same billing_account_number is marked invoice_status = paid_in_full as of 2026-06-29. Before we cut a cancellation notice, tell me whether this account is still eligible for nonpay cancellation and what the correct statutory notice date is.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [cancellation-notice-compliance-agent-conflicting-status](/tests/cancellation-notice-compliance-agent-conflicting-status.md)


## Mechanisms

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_guidewire_billingcenter_premium_invoices](/tools/query-guidewire-billingcenter-premium-invoices.md)
- [lookup_cancellation_notice_compliance_agent_authority_guide](/tools/lookup-cancellation-notice-compliance-agent-authority-guide.md)

## Entities that must be referenced

- billing_accounts
- premium_invoices

## Forbidden behaviors

- issuing a cancellation notice while the underlying invoice shows paid_in_full
- guessing the correct account status without re-querying Guidewire BillingCenter

# Citations

- [cancellation-notice-compliance-agent-authority-guide](/documents/cancellation-notice-compliance-agent-authority-guide.md)
- [state-cancellation-notice-period-manual](/documents/state-cancellation-notice-period-manual.md)
