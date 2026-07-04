---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the recommend step in Amdocs CES Billing with a full audit trail, and escalate exceptions to the Revenue Assurance Analyst."
source_id: act_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the recommend step in Amdocs CES Billing with a full audit trail, and escalate exceptions to the Revenue Assurance Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_usage_rating_anomaly_monitor_assurance_runbook](/tools/lookup-usage-rating-anomaly-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_recommend](/tools/action-amdocs-ces-billing-recommend.md)
