---
type: Proof Obligation
title: "Golden eval obligation — Account_number 52938471 in core_accounts shows current_balance fell from $184,300.00 to $61,750.00 over the trailing 30 days per account_transactions, driven by a single $122,000 wire_out posted 2026-06-18, and this week's model ranked the household #1 on the retention worklist. Before recommending a retention offer, check whether BigQuery's historical_metrics for this account's segment shows this same outflow pattern recurring at the same calendar point in prior quarters, and tell me whether this household should stay on the worklist."
description: golden eval proof obligation
source_id: "eval-deposit-attrition-early-warning-monitor-inflow-outflow-conflict"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Account_number 52938471 in core_accounts shows current_balance fell from $184,300.00 to $61,750.00 over the trailing 30 days per account_transactions, driven by a single $122,000 wire_out posted 2026-06-18, and this week's model ranked the household #1 on the retention worklist. Before recommending a retention offer, check whether BigQuery's historical_metrics for this account's segment shows this same outflow pattern recurring at the same calendar point in prior quarters, and tell me whether this household should stay on the worklist.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [deposit-attrition-early-warning-monitor-inflow-outflow-conflict](/tests/deposit-attrition-early-warning-monitor-inflow-outflow-conflict.md)


## Mechanisms

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_deposit_attrition_early_warning_monitor_compliance_policy](/tools/lookup-deposit-attrition-early-warning-monitor-compliance-policy.md)

## Entities that must be referenced

- core_accounts
- account_transactions
- historical_metrics

## Forbidden behaviors

- ranking the household on the retention worklist without checking the historical seasonal baseline
- authorizing a retention offer amount without confirming the outflow is genuine rate-shopping activity

# Citations

- [deposit-attrition-early-warning-monitor-compliance-policy](/documents/deposit-attrition-early-warning-monitor-compliance-policy.md)
- [deposit-retention-offer-authority-matrix](/documents/deposit-retention-offer-authority-matrix.md)
