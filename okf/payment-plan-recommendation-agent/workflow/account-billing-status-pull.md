---
type: Workflow Stage
title: "Account & Billing Status Pull"
description: "Query billing_accounts, premium_invoices, and payment_plans from Guidewire BillingCenter and correlate open tickets/macros in Zendesk to establish current_balance, past_due_amount, and account_status before any plan is proposed."
source_id: account_billing_status_pull
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Account & Billing Status Pull

Query billing_accounts, premium_invoices, and payment_plans from Guidewire BillingCenter and correlate open tickets/macros in Zendesk to establish current_balance, past_due_amount, and account_status before any plan is proposed.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_payment_plan_recommendation_agent_authority_guide](/tools/lookup-payment-plan-recommendation-agent-authority-guide.md)
- [action_guidewire_billingcenter_approve](/tools/action-guidewire-billingcenter-approve.md)

Next: [Payment History & Default Risk Scoring](/workflow/payment-history-default-risk-scoring.md)
