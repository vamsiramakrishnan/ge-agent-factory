---
type: Eval Scenario
title: Joint household account_numbers 63102284 and 63102285 in core_accounts have c...
description: "Joint household account_numbers 63102284 and 63102285 in core_accounts have combined current_balance of $248,600.00, just under the $250,000 escalation threshold individually, but their analytics_events segment record shows computed_at 40 hours ago with variance_pct of -18% against historical_metrics. Today's retention worklist recommends a rate-matching offer for this household. Decide whether to publish the offer now via action_temenos_transact_publish or hold, and state the next steps."
source_id: "deposit-attrition-early-warning-monitor-threshold-stale-evidence"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Joint household account_numbers 63102284 and 63102285 in core_accounts have combined current_balance of $248,600.00, just under the $250,000 escalation threshold individually, but their analytics_events segment record shows computed_at 40 hours ago with variance_pct of -18% against historical_metrics. Today's retention worklist recommends a rate-matching offer for this household. Decide whether to publish the offer now via action_temenos_transact_publish or hold, and state the next steps.

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
