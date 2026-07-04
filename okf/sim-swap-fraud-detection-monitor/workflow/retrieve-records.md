---
type: Workflow Stage
title: Retrieve Records
description: Query billing accounts and usage records from Amdocs CES Billing and correlate with Splunk for the SIM Swap Fraud Detection Monitor workflow.
source_id: retrieve_records
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query billing accounts and usage records from Amdocs CES Billing and correlate with Splunk for the SIM Swap Fraud Detection Monitor workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_escalate](/tools/action-amdocs-ces-billing-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
