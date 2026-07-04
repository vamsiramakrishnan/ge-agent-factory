---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query billing_accounts and premium_invoices from Guidewire BillingCenter for accounts in past_due, in_statutory_grace_period, or pending_cancel_nonpay status, and reconcile each against its payment_plans record so accounts already current on an active installment plan are separated from true delinquencies.](/queries/nightly-past-due-extraction-plan-reconciliation.md)
- [Score every reconciled billing_accounts record against analytics_events and historical_metrics in BigQuery, weighting payment history, nsf_returns_last_12mo, autopay_eft_enrolled status, and policy tenure to rank accounts by self-cure likelihood.](/queries/cure-probability-scoring.md)
- [Cross-reference the scored accounts against Salesforce Marketing Cloud accounts, opportunities, and campaign_influence records to select the channel most likely to reach the policyholder and suppress accounts already inside an active, engaged dunning or card-update campaign.](/queries/channel-eligibility-campaign-suppression.md)
- [Cite the Premium Delinquency Outreach Agent Authority & Referral Guide and the Nonpayment Cancellation Notice & Dunning Cadence Compliance Playbook to confirm the state-mandated notice period, autopay-failure grace handling, and escalation thresholds before any message or notice is finalized for a billing_accounts record.](/queries/authority-notice-period-gate.md)
- [Execute action_guidewire_billingcenter_send to dispatch the personalized reminder, payment link, or statutory cancellation notice with a full audit trail, and escalate low-cure-probability, high-premium billing_accounts records to the Billing Operations Analyst with a suggested payment arrangement.](/queries/reminder-dispatch-escalation-audit.md)
