---
type: Eval Scenario
title: "Billing account BAC-100482 (policy PLC-778821) shows account_status = pending..."
description: "Billing account BAC-100482 (policy PLC-778821) shows account_status = pending_cancel_nonpay with a past_due_amount of $612.40, but premium_invoices record INV-55931 for that same billing_account_number is marked invoice_status = paid_in_full as of 2026-06-29. Before we cut a cancellation notice, tell me whether this account is still eligible for nonpay cancellation and what the correct statutory notice date is."
source_id: "cancellation-notice-compliance-agent-conflicting-status"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Billing account BAC-100482 (policy PLC-778821) shows account_status = pending_cancel_nonpay with a past_due_amount of $612.40, but premium_invoices record INV-55931 for that same billing_account_number is marked invoice_status = paid_in_full as of 2026-06-29. Before we cut a cancellation notice, tell me whether this account is still eligible for nonpay cancellation and what the correct statutory notice date is.

## Validates

- [nonpay-queue-triage](/queries/nonpay-queue-triage.md)

## Mechanisms to call

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_guidewire_billingcenter_premium_invoices](/tools/query-guidewire-billingcenter-premium-invoices.md)
- [lookup_cancellation_notice_compliance_agent_authority_guide](/tools/lookup-cancellation-notice-compliance-agent-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Cancellation Notice Compliance Agent Authority & Referral Guide](/documents/cancellation-notice-compliance-agent-authority-guide.md)
- [State Cancellation & Nonrenewal Notice Period Manual](/documents/state-cancellation-notice-period-manual.md)
