---
type: Workflow Stage
title: "Lockbox & Remittance Intake"
description: "Pull daily lockbox receipts and agency bulk remittance files alongside open billing_accounts and premium_invoices balances from Guidewire BillingCenter via query_guidewire_billingcenter_billing_accounts, staging every unmatched item as suspense cash."
source_id: lockbox_remittance_intake
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Lockbox & Remittance Intake

Pull daily lockbox receipts and agency bulk remittance files alongside open billing_accounts and premium_invoices balances from Guidewire BillingCenter via query_guidewire_billingcenter_billing_accounts, staging every unmatched item as suspense cash.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [lookup_unapplied_cash_resolution_agent_authority_guide](/tools/lookup-unapplied-cash-resolution-agent-authority-guide.md)
- [action_guidewire_billingcenter_file](/tools/action-guidewire-billingcenter-file.md)

Next: [Fuzzy Suspense Matching](/workflow/fuzzy-suspense-matching.md)
