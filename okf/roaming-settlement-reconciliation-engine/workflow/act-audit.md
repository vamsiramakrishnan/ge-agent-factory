---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the file step in Amdocs CES Billing with a full audit trail, and escalate exceptions to the Wholesale Settlements Analyst."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the file step in Amdocs CES Billing with a full audit trail, and escalate exceptions to the Wholesale Settlements Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)
- [action_amdocs_ces_billing_file](/tools/action-amdocs-ces-billing-file.md)
