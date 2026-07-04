---
type: Workflow Stage
title: "SIM Swap Event Intake & Correlation"
description: "Pull the triggering swap from Amdocs CES Billing billing_accounts and usage_records, then correlate the subscriber_key against Splunk log_events and search_jobs to reconstruct the authentication trail (credential resets, channel used, prior failed attempts) around the swap timestamp."
source_id: sim_swap_event_intake_correlation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# SIM Swap Event Intake & Correlation

Pull the triggering swap from Amdocs CES Billing billing_accounts and usage_records, then correlate the subscriber_key against Splunk log_events and search_jobs to reconstruct the authentication trail (credential resets, channel used, prior failed attempts) around the swap timestamp.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_escalate](/tools/action-amdocs-ces-billing-escalate.md)

Next: [Behavioral Baseline & Risk Scoring](/workflow/behavioral-baseline-risk-scoring.md)
