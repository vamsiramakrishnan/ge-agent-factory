---
type: Eval Scenario
title: "Billing account 40225591 (subscriber 3127790044) had a SIM swap on 2026-06-30..."
description: "Billing account 40225591 (subscriber 3127790044) had a SIM swap on 2026-06-30 that the monitor scored at 0.61 risk — just under the 0.65 auto-hold threshold. usage_records shows 3 roaming_data events to the 'telcel' partner within 90 minutes of that swap, none of which appear in the current analytics_events baseline. It's now 2026-07-03. Rerun the assessment and recommend the next action."
source_id: "sim-swap-fraud-detection-monitor-stale-threshold-edge"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Billing account 40225591 (subscriber 3127790044) had a SIM swap on 2026-06-30 that the monitor scored at 0.61 risk — just under the 0.65 auto-hold threshold. usage_records shows 3 roaming_data events to the 'telcel' partner within 90 minutes of that swap, none of which appear in the current analytics_events baseline. It's now 2026-07-03. Rerun the assessment and recommend the next action.

## Validates

- [sim-swap-event-intake-correlation](/queries/sim-swap-event-intake-correlation.md)

## Mechanisms to call

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [SIM Swap Fraud Detection Monitor Service Assurance Runbook](/documents/sim-swap-fraud-detection-monitor-assurance-runbook.md)
