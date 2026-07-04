---
type: Workflow Stage
title: "Dispute Filing & Partner Settlement Tracking"
description: "Execute the file step in Amdocs CES Billing to submit the settlement adjustment or dispute package against billing_accounts, attach the full audit trail, and escalate exceptions above the delegation thresholds to the Wholesale Settlements Analyst before the next billing cycle closes."
source_id: dispute_filing_partner_settlement_tracking
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Dispute Filing & Partner Settlement Tracking

Execute the file step in Amdocs CES Billing to submit the settlement adjustment or dispute package against billing_accounts, attach the full audit trail, and escalate exceptions above the delegation thresholds to the Wholesale Settlements Analyst before the next billing cycle closes.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)
- [action_amdocs_ces_billing_file](/tools/action-amdocs-ces-billing-file.md)
