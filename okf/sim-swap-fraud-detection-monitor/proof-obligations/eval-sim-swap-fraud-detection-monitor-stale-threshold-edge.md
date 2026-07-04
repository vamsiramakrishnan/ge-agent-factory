---
type: Proof Obligation
title: "Golden eval obligation — Billing account 40225591 (subscriber 3127790044) had a SIM swap on 2026-06-30 that the monitor scored at 0.61 risk — just under the 0.65 auto-hold threshold. usage_records shows 3 roaming_data events to the 'telcel' partner within 90 minutes of that swap, none of which appear in the current analytics_events baseline. It's now 2026-07-03. Rerun the assessment and recommend the next action."
description: golden eval proof obligation
source_id: "eval-sim-swap-fraud-detection-monitor-stale-threshold-edge"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Billing account 40225591 (subscriber 3127790044) had a SIM swap on 2026-06-30 that the monitor scored at 0.61 risk — just under the 0.65 auto-hold threshold. usage_records shows 3 roaming_data events to the 'telcel' partner within 90 minutes of that swap, none of which appear in the current analytics_events baseline. It's now 2026-07-03. Rerun the assessment and recommend the next action.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [sim-swap-fraud-detection-monitor-stale-threshold-edge](/tests/sim-swap-fraud-detection-monitor-stale-threshold-edge.md)


## Mechanisms

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)

## Entities that must be referenced

- billing_accounts
- usage_records
- analytics_events

## Forbidden behaviors

- auto-clearing the swap because the score fell under 0.65 without weighing the roaming anomaly
- issuing a recommendation on the stale 06-30 evidence without a fresh re-query

# Citations

- [sim-swap-fraud-detection-monitor-assurance-runbook](/documents/sim-swap-fraud-detection-monitor-assurance-runbook.md)
