---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the create step in Amdocs CES Billing with a full audit trail, and escalate exceptions to the Revenue Assurance Analyst."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the create step in Amdocs CES Billing with a full audit trail, and escalate exceptions to the Revenue Assurance Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_revenue_leakage_detection_analyzer_assurance_runbook](/tools/lookup-revenue-leakage-detection-analyzer-assurance-runbook.md)
- [action_amdocs_ces_billing_create](/tools/action-amdocs-ces-billing-create.md)
