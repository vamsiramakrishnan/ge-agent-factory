---
type: Workflow Stage
title: Retrieve Records
description: Query billing accounts and usage records from Amdocs CES Billing for the Usage Rating Anomaly Monitor workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query billing accounts and usage records from Amdocs CES Billing for the Usage Rating Anomaly Monitor workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [lookup_usage_rating_anomaly_monitor_assurance_runbook](/tools/lookup-usage-rating-anomaly-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_recommend](/tools/action-amdocs-ces-billing-recommend.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
