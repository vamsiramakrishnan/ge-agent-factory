---
type: Workflow Stage
title: "Agency Rate & Chargeback Verification"
description: "Cross-check each premium_invoices installment and payment_plans status against the Commission Chargeback & Rate Adjustment Runbook and the Authority & Referral Guide via lookup_agent_commission_reconciliation_engine_authority_guide to confirm the contracted commission rate and chargeback eligibility."
source_id: agency_rate_chargeback_verification
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Agency Rate & Chargeback Verification

Cross-check each premium_invoices installment and payment_plans status against the Commission Chargeback & Rate Adjustment Runbook and the Authority & Referral Guide via lookup_agent_commission_reconciliation_engine_authority_guide to confirm the contracted commission rate and chargeback eligibility.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [lookup_agent_commission_reconciliation_engine_authority_guide](/tools/lookup-agent-commission-reconciliation-engine-authority-guide.md)

Next: [Variance & Duplicate-Payment Detection](/workflow/variance-duplicate-payment-detection.md)
