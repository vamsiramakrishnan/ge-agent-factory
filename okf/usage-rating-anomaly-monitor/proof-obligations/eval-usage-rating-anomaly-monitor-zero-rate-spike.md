---
type: Proof Obligation
title: "Golden eval obligation — Mediation batch 44812 posted 3,900 usage_records on 2026-07-02 for rate_plan_code UNL_PLUS_5G. Rated_events show 1,340 of those events flagged zero_rated=true — versus a trailing 7-day average of 310/day for that plan — while billing_account 82234110 (bill_cycle_day 14) is scheduled to invoice on 2026-07-14. Reconcile whether this is a mediation glitch or a rating-group misconfiguration from the 2026-07-01 catalog push, and tell me whether we should hold the 07-14 cycle."
description: golden eval proof obligation
source_id: "eval-usage-rating-anomaly-monitor-zero-rate-spike"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Mediation batch 44812 posted 3,900 usage_records on 2026-07-02 for rate_plan_code UNL_PLUS_5G. Rated_events show 1,340 of those events flagged zero_rated=true — versus a trailing 7-day average of 310/day for that plan — while billing_account 82234110 (bill_cycle_day 14) is scheduled to invoice on 2026-07-14. Reconcile whether this is a mediation glitch or a rating-group misconfiguration from the 2026-07-01 catalog push, and tell me whether we should hold the 07-14 cycle.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [usage-rating-anomaly-monitor-zero-rate-spike](/tests/usage-rating-anomaly-monitor-zero-rate-spike.md)


## Mechanisms

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_usage_rating_anomaly_monitor_assurance_runbook](/tools/lookup-usage-rating-anomaly-monitor-assurance-runbook.md)

## Entities that must be referenced

- usage_records
- rated_events
- billing_accounts

## Forbidden behaviors

- recommending a bill-cycle release or rerate before the catalog-push root cause is confirmed
- approving the hold or release without citing the rerate/bill-hold policy

# Citations

- [usage-rating-anomaly-monitor-assurance-runbook](/documents/usage-rating-anomaly-monitor-assurance-runbook.md)
- [usage-rating-anomaly-monitor-rerate-billhold-policy](/documents/usage-rating-anomaly-monitor-rerate-billhold-policy.md)
