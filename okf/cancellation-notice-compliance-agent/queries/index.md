---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull billing_accounts flagged pending_cancel_nonpay or in_statutory_grace_period, together with past-due premium_invoices, from Guidewire BillingCenter to identify which policies are entering the cancellation notice window.](/queries/nonpay-queue-triage.md)
- [Cross-reference each flagged account's risk state against the Cancellation Notice Compliance Agent Authority & Referral Guide and the State Cancellation & Nonrenewal Notice Period Manual to confirm the exact statutory notice period, required content, and lienholder/mortgagee-copy rules before any notice is drafted.](/queries/statutory-notice-window-verification.md)
- [Generate the compliant cancellation notice and dispatch it as a DocuSign envelope to the account_holder and any required lienholder recipients, tracking delivery through envelopes and recipients records.](/queries/notice-drafting-tracked-dispatch.md)
- [Reconcile DocuSign audit_trails against the dispatched envelope for certified-mail or tracked-delivery confirmation, then file the completed cancellation action in Guidewire BillingCenter via action_guidewire_billingcenter_file with the audit trail attached to the billing_accounts record.](/queries/proof-of-mailing-reconciliation-filing.md)
- [Compare current-period notice-defect rates against BigQuery analytics_events and historical_metrics baselines, escalate any notice-window breach or missing lienholder copy to the Billing Supervisor, and update KPI aggregates.](/queries/exception-escalation-compliance-reporting.md)
