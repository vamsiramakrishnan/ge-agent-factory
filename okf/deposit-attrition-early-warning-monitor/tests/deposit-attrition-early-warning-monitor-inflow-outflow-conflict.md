---
type: Eval Scenario
title: Account_number 52938471 in core_accounts shows current_balance fell from $184...
description: "Account_number 52938471 in core_accounts shows current_balance fell from $184,300.00 to $61,750.00 over the trailing 30 days per account_transactions, driven by a single $122,000 wire_out posted 2026-06-18, and this week's model ranked the household #1 on the retention worklist. Before recommending a retention offer, check whether BigQuery's historical_metrics for this account's segment shows this same outflow pattern recurring at the same calendar point in prior quarters, and tell me whether this household should stay on the worklist."
source_id: "deposit-attrition-early-warning-monitor-inflow-outflow-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Account_number 52938471 in core_accounts shows current_balance fell from $184,300.00 to $61,750.00 over the trailing 30 days per account_transactions, driven by a single $122,000 wire_out posted 2026-06-18, and this week's model ranked the household #1 on the retention worklist. Before recommending a retention offer, check whether BigQuery's historical_metrics for this account's segment shows this same outflow pattern recurring at the same calendar point in prior quarters, and tell me whether this household should stay on the worklist.

## Validates

- [baseline-rate-spread-reconciliation](/queries/baseline-rate-spread-reconciliation.md)

## Mechanisms to call

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_deposit_attrition_early_warning_monitor_compliance_policy](/tools/lookup-deposit-attrition-early-warning-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Deposit Attrition Early Warning Monitor Banking Compliance Policy](/documents/deposit-attrition-early-warning-monitor-compliance-policy.md)
- [Deposit Retention Offer Authority & Rate Exception Matrix](/documents/deposit-retention-offer-authority-matrix.md)
