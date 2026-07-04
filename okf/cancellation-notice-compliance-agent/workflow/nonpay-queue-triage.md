---
type: Workflow Stage
title: Nonpay Queue Triage
description: "Pull billing_accounts flagged pending_cancel_nonpay or in_statutory_grace_period, together with past-due premium_invoices, from Guidewire BillingCenter to identify which policies are entering the cancellation notice window."
source_id: nonpay_queue_triage
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Nonpay Queue Triage

Pull billing_accounts flagged pending_cancel_nonpay or in_statutory_grace_period, together with past-due premium_invoices, from Guidewire BillingCenter to identify which policies are entering the cancellation notice window.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [lookup_cancellation_notice_compliance_agent_authority_guide](/tools/lookup-cancellation-notice-compliance-agent-authority-guide.md)
- [action_guidewire_billingcenter_file](/tools/action-guidewire-billingcenter-file.md)

Next: [Statutory Notice Window Verification](/workflow/statutory-notice-window-verification.md)
