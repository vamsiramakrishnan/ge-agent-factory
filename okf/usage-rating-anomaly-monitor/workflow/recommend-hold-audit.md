---
type: Workflow Stage
title: "Recommend, Hold, & Audit"
description: "Execute action_amdocs_ces_billing_recommend against Amdocs CES Billing to hold the affected bill cycle or trigger reprocessing, emit the audit trail, and escalate exceptions to the Revenue Assurance Analyst or revenue_assurance_manager."
source_id: recommend_hold_audit
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Recommend, Hold, & Audit

Execute action_amdocs_ces_billing_recommend against Amdocs CES Billing to hold the affected bill cycle or trigger reprocessing, emit the audit trail, and escalate exceptions to the Revenue Assurance Analyst or revenue_assurance_manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_usage_rating_anomaly_monitor_assurance_runbook](/tools/lookup-usage-rating-anomaly-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_recommend](/tools/action-amdocs-ces-billing-recommend.md)
