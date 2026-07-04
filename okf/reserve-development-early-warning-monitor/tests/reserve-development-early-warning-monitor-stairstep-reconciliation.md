---
type: Eval Scenario
title: "Claim CLM-2026-04471 (policy PLC-88291, workers_comp, TX) shows a posted rese..."
description: "Claim CLM-2026-04471 (policy PLC-88291, workers_comp, TX) shows a posted reserve_amount of $42,000 in reserve_lines, but three reserve_increase transactions were logged on 2026-05-02, 2026-05-19, and 2026-06-30, each filed under authority_level_used adjuster_25k. BigQuery historical_metrics puts model-predicted severity for this cohort at $118,000 as of the 2026-06 computed_at period. Reconcile whether this is a stair-stepping pattern, determine the correct next action, and cite your evidence."
source_id: "reserve-development-early-warning-monitor-stairstep-reconciliation"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim CLM-2026-04471 (policy PLC-88291, workers_comp, TX) shows a posted reserve_amount of $42,000 in reserve_lines, but three reserve_increase transactions were logged on 2026-05-02, 2026-05-19, and 2026-06-30, each filed under authority_level_used adjuster_25k. BigQuery historical_metrics puts model-predicted severity for this cohort at $118,000 as of the 2026-06 computed_at period. Reconcile whether this is a stair-stepping pattern, determine the correct next action, and cite your evidence.

## Validates

- [reserve-signal-intake](/queries/reserve-signal-intake.md)

## Mechanisms to call

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_reserve_development_early_warning_monitor_authority_guide](/tools/lookup-reserve-development-early-warning-monitor-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Reserve Development Early Warning Monitor Authority & Referral Guide](/documents/reserve-development-early-warning-monitor-authority-guide.md)
- [Reserve Diary & Stair-Step Prevention Runbook](/documents/reserve-diary-stairstep-prevention-runbook.md)
