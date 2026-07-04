---
type: Workflow Stage
title: Commission Run Intake
description: "Pull billing_accounts, premium_invoices, and payment_plans for the closing period from Guidewire BillingCenter via query_guidewire_billingcenter_billing_accounts to assemble the raw commission run before any statement math begins."
source_id: commission_run_intake
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Commission Run Intake

Pull billing_accounts, premium_invoices, and payment_plans for the closing period from Guidewire BillingCenter via query_guidewire_billingcenter_billing_accounts to assemble the raw commission run before any statement math begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [lookup_agent_commission_reconciliation_engine_authority_guide](/tools/lookup-agent-commission-reconciliation-engine-authority-guide.md)
- [action_guidewire_billingcenter_publish](/tools/action-guidewire-billingcenter-publish.md)

Next: [Agency Rate & Chargeback Verification](/workflow/agency-rate-chargeback-verification.md)
