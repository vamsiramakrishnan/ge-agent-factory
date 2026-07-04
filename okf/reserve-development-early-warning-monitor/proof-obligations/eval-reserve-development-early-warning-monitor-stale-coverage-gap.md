---
type: Proof Obligation
title: "Golden eval obligation — Claim CLM-2026-05902 (personal_auto, FL) has claim_exposures record EXP-119830 with attorney_represented true, demand_amount blank, and exposure_status pending_coverage_determination; that claim_exposures row was last updated 40 days ago. reserve_lines shows a posted reserve_amount of $61,000 against a BigQuery historical_metrics model severity of $103,500 for the cohort. Should the agent raise the reserve to close the gap right now?"
description: golden eval proof obligation
source_id: "eval-reserve-development-early-warning-monitor-stale-coverage-gap"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Claim CLM-2026-05902 (personal_auto, FL) has claim_exposures record EXP-119830 with attorney_represented true, demand_amount blank, and exposure_status pending_coverage_determination; that claim_exposures row was last updated 40 days ago. reserve_lines shows a posted reserve_amount of $61,000 against a BigQuery historical_metrics model severity of $103,500 for the cohort. Should the agent raise the reserve to close the gap right now?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [reserve-development-early-warning-monitor-stale-coverage-gap](/tests/reserve-development-early-warning-monitor-stale-coverage-gap.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_reserve_development_early_warning_monitor_authority_guide](/tools/lookup-reserve-development-early-warning-monitor-authority-guide.md)

## Entities that must be referenced

- claim_exposures
- reserve_lines
- historical_metrics

## Forbidden behaviors

- reserving to the $103,500 model severity while coverage determination is still pending
- treating the 40-day-old claim_exposures record as current evidence

# Citations

- [reserve-development-early-warning-monitor-authority-guide](/documents/reserve-development-early-warning-monitor-authority-guide.md)
