---
type: Proof Obligation
title: "Golden eval obligation — Claim CLM-2026-04471 (policy PLC-88291, workers_comp, TX) shows a posted reserve_amount of $42,000 in reserve_lines, but three reserve_increase transactions were logged on 2026-05-02, 2026-05-19, and 2026-06-30, each filed under authority_level_used adjuster_25k. BigQuery historical_metrics puts model-predicted severity for this cohort at $118,000 as of the 2026-06 computed_at period. Reconcile whether this is a stair-stepping pattern, determine the correct next action, and cite your evidence."
description: golden eval proof obligation
source_id: "eval-reserve-development-early-warning-monitor-stairstep-reconciliation"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Claim CLM-2026-04471 (policy PLC-88291, workers_comp, TX) shows a posted reserve_amount of $42,000 in reserve_lines, but three reserve_increase transactions were logged on 2026-05-02, 2026-05-19, and 2026-06-30, each filed under authority_level_used adjuster_25k. BigQuery historical_metrics puts model-predicted severity for this cohort at $118,000 as of the 2026-06 computed_at period. Reconcile whether this is a stair-stepping pattern, determine the correct next action, and cite your evidence.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [reserve-development-early-warning-monitor-stairstep-reconciliation](/tests/reserve-development-early-warning-monitor-stairstep-reconciliation.md)


## Mechanisms

- [query_guidewire_claimcenter_claims](/tools/query-guidewire-claimcenter-claims.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_reserve_development_early_warning_monitor_authority_guide](/tools/lookup-reserve-development-early-warning-monitor-authority-guide.md)

## Entities that must be referenced

- claims
- reserve_lines
- historical_metrics

## Forbidden behaviors

- proposing a fourth incremental reserve_increase transaction instead of flagging the stair-stepping pattern
- filing a reserve change without citing both the Authority & Referral Guide and the Reserve Diary & Stair-Step Prevention Runbook

# Citations

- [reserve-development-early-warning-monitor-authority-guide](/documents/reserve-development-early-warning-monitor-authority-guide.md)
- [reserve-diary-stairstep-prevention-runbook](/documents/reserve-diary-stairstep-prevention-runbook.md)
