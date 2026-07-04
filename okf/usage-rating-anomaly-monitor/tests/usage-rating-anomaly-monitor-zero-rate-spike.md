---
type: Eval Scenario
title: "Mediation batch 44812 posted 3,900 usage_records on 2026-07-02 for rate_plan_..."
description: "Mediation batch 44812 posted 3,900 usage_records on 2026-07-02 for rate_plan_code UNL_PLUS_5G. Rated_events show 1,340 of those events flagged zero_rated=true — versus a trailing 7-day average of 310/day for that plan — while billing_account 82234110 (bill_cycle_day 14) is scheduled to invoice on 2026-07-14. Reconcile whether this is a mediation glitch or a rating-group misconfiguration from the 2026-07-01 catalog push, and tell me whether we should hold the 07-14 cycle."
source_id: "usage-rating-anomaly-monitor-zero-rate-spike"
generation_status: inferred
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Mediation batch 44812 posted 3,900 usage_records on 2026-07-02 for rate_plan_code UNL_PLUS_5G. Rated_events show 1,340 of those events flagged zero_rated=true — versus a trailing 7-day average of 310/day for that plan — while billing_account 82234110 (bill_cycle_day 14) is scheduled to invoice on 2026-07-14. Reconcile whether this is a mediation glitch or a rating-group misconfiguration from the 2026-07-01 catalog push, and tell me whether we should hold the 07-14 cycle.

## Validates

- [catalog-change-baseline-watch](/queries/catalog-change-baseline-watch.md)

## Mechanisms to call

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_usage_rating_anomaly_monitor_assurance_runbook](/tools/lookup-usage-rating-anomaly-monitor-assurance-runbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Usage Rating Anomaly Monitor Service Assurance Runbook](/documents/usage-rating-anomaly-monitor-assurance-runbook.md)
- [Rerate & Bill-Cycle Hold Governance Policy](/documents/usage-rating-anomaly-monitor-rerate-billhold-policy.md)
