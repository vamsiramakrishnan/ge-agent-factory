---
type: Workflow Stage
title: "Auto-Apply & Specialist Queueing"
description: "Post high-confidence matches straight to the billing_accounts current_balance and payment_plans installment ledger, and queue ambiguous candidates with ranked insurance_3_records case evidence (query_insurance_3_insurance_3_records) for the Cash Applications Specialist's one-click review."
source_id: auto_apply_specialist_queueing
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Auto-Apply & Specialist Queueing

Post high-confidence matches straight to the billing_accounts current_balance and payment_plans installment ledger, and queue ambiguous candidates with ranked insurance_3_records case evidence (query_insurance_3_insurance_3_records) for the Cash Applications Specialist's one-click review.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_guidewire_billingcenter_billing_accounts](/tools/query-guidewire-billingcenter-billing-accounts.md)
- [query_insurance_3_insurance_3_records](/tools/query-insurance-3-insurance-3-records.md)
- [lookup_unapplied_cash_resolution_agent_authority_guide](/tools/lookup-unapplied-cash-resolution-agent-authority-guide.md)

Next: [Dunning Suppression, Filing & Audit](/workflow/dunning-suppression-filing-audit.md)
