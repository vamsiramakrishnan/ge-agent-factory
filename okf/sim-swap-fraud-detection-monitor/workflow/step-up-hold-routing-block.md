---
type: Workflow Stage
title: "Step-Up Hold & Routing Block"
description: "For swaps clearing the risk threshold, place a step-up-verification hold on the billing_accounts record and a temporary block on premium and international routing referenced in rated_events, pending independent subscriber verification."
source_id: step_up_hold_routing_block
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Step-Up Hold & Routing Block

For swaps clearing the risk threshold, place a step-up-verification hold on the billing_accounts record and a temporary block on premium and international routing referenced in rated_events, pending independent subscriber verification.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_escalate](/tools/action-amdocs-ces-billing-escalate.md)

Next: [Runbook-Gated Evidence Validation](/workflow/runbook-gated-evidence-validation.md)
