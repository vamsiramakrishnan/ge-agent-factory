---
type: Eval Scenario
title: Run the SIM Swap Fraud Detection Monitor workflow for the current period. Cit...
description: "Run the SIM Swap Fraud Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "sim-swap-fraud-detection-monitor-end-to-end"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the SIM Swap Fraud Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [sim-swap-event-intake-correlation](/queries/sim-swap-event-intake-correlation.md)

## Mechanisms to call

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_escalate](/tools/action-amdocs-ces-billing-escalate.md)

## Success rubric

Action escalate executed against Amdocs CES Billing, with audit-trail entry and Fraud Operations Analyst notified of outcomes.

# Citations

- [SIM Swap Fraud Detection Monitor Service Assurance Runbook](/documents/sim-swap-fraud-detection-monitor-assurance-runbook.md)
