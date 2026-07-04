---
type: Workflow Stage
title: Retrieve Records
description: Query billing accounts and premium invoices from Guidewire BillingCenter and correlate with Zendesk for the Payment Plan Recommendation Agent workflow.
source_id: retrieve_records
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query billing accounts and premium invoices from Guidewire BillingCenter and correlate with Zendesk for the Payment Plan Recommendation Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_payment_plan_recommendation_agent_authority_guide](/tools/lookup-payment-plan-recommendation-agent-authority-guide.md)
- [action_guidewire_billingcenter_approve](/tools/action-guidewire-billingcenter-approve.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
