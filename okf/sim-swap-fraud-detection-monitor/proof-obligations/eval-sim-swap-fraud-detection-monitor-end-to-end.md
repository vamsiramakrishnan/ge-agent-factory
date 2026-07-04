---
type: Proof Obligation
title: "Golden eval obligation — Run the SIM Swap Fraud Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-sim-swap-fraud-detection-monitor-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the SIM Swap Fraud Detection Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [sim-swap-fraud-detection-monitor-end-to-end](/tests/sim-swap-fraud-detection-monitor-end-to-end.md)


## Mechanisms

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_splunk_log_events](/tools/query-splunk-log-events.md)
- [lookup_sim_swap_fraud_detection_monitor_assurance_runbook](/tools/lookup-sim-swap-fraud-detection-monitor-assurance-runbook.md)
- [action_amdocs_ces_billing_escalate](/tools/action-amdocs-ces-billing-escalate.md)

## Entities that must be referenced

- billing_accounts
- analytics_events
- log_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute escalate without two-system evidence

# Citations

- [sim-swap-fraud-detection-monitor-assurance-runbook](/documents/sim-swap-fraud-detection-monitor-assurance-runbook.md)
