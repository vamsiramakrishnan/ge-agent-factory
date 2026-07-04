---
type: Query Capability
title: "Compare each originator's rolled-up rate against the Nacha unauthorized (0.5%..."
description: "Compare each originator's rolled-up rate against the Nacha unauthorized (0.5%), administrative (3%), and overall (15%) thresholds, and project the calendar date of breach using the analytics_events trend."
source_id: "nacha-threshold-breach-trend-projection"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compare each originator's rolled-up rate against the Nacha unauthorized (0.5%), administrative (3%), and overall (15%) thresholds, and project the calendar date of breach using the analytics_events trend.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [nacha_threshold_breach_trend_projection](/workflow/nacha-threshold-breach-trend-projection.md)

## Evidence expected

- sql_result

## Evals

- [Run the ACH Return Root Cause Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ach-return-root-cause-analyzer-end-to-end.md)
- [Originator 'Meridian Payroll Services' (instruction_id 742118803) shows an unauthorized return rate of 0.61% in this morning's BigQuery analytics_events rollup for the week of 2026-06-29, but the Looker dashboards scorecard published yesterday still shows 0.38% for the same originator and period. Reconcile the discrepancy against FIS Payments Hub clearing_batches before notifying the relationship owner, and tell me whether we're past the Nacha 0.5% unauthorized threshold.](/tests/ach-return-root-cause-analyzer-conflicting-return-rate.md)
- [Originator 'Harbor Fitness Clubs LLC' (instruction_id 758204471, SEC code WEB) is sitting at a 0.49% trailing-60-day unauthorized return rate per the analytics_events rollup computed_at 2026-07-02T09:00:00Z, just under the Nacha 0.5% threshold. It is now 2026-07-04T14:00:00Z. Confirm whether we need to notify the relationship owner today.](/tests/ach-return-root-cause-analyzer-stale-evidence-edge-case.md)

# Citations

- [ACH Return Root Cause Analyzer Banking Compliance Policy](/documents/ach-return-root-cause-analyzer-compliance-policy.md)
- [ACH Return Rate Risk Mitigation & Nacha Threshold Playbook](/documents/ach-return-rate-risk-mitigation-playbook.md)
