---
type: Workflow Stage
title: "Nightly Past-Due Extraction & Plan Reconciliation"
description: "Query billing_accounts and premium_invoices from Guidewire BillingCenter for accounts in past_due, in_statutory_grace_period, or pending_cancel_nonpay status, and reconcile each against its payment_plans record so accounts already current on an active installment plan are separated from true delinquencies."
source_id: nightly_past_due_extraction_plan_reconciliation
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Nightly Past-Due Extraction & Plan Reconciliation

Query billing_accounts and premium_invoices from Guidewire BillingCenter for accounts in past_due, in_statutory_grace_period, or pending_cancel_nonpay status, and reconcile each against its payment_plans record so accounts already current on an active installment plan are separated from true delinquencies.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [lookup_premium_delinquency_outreach_agent_authority_guide](/tools/lookup-premium-delinquency-outreach-agent-authority-guide.md)
- [action_guidewire_billingcenter_send](/tools/action-guidewire-billingcenter-send.md)

Next: [Cure-Probability Scoring](/workflow/cure-probability-scoring.md)
