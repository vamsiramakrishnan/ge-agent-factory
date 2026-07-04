---
type: Eval Scenario
title: "Claim CLM-2026-05902 (personal_auto, FL) has claim_exposures record EXP-11983..."
description: "Claim CLM-2026-05902 (personal_auto, FL) has claim_exposures record EXP-119830 with attorney_represented true, demand_amount blank, and exposure_status pending_coverage_determination; that claim_exposures row was last updated 40 days ago. reserve_lines shows a posted reserve_amount of $61,000 against a BigQuery historical_metrics model severity of $103,500 for the cohort. Should the agent raise the reserve to close the gap right now?"
source_id: "reserve-development-early-warning-monitor-stale-coverage-gap"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Claim CLM-2026-05902 (personal_auto, FL) has claim_exposures record EXP-119830 with attorney_represented true, demand_amount blank, and exposure_status pending_coverage_determination; that claim_exposures row was last updated 40 days ago. reserve_lines shows a posted reserve_amount of $61,000 against a BigQuery historical_metrics model severity of $103,500 for the cohort. Should the agent raise the reserve to close the gap right now?

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
