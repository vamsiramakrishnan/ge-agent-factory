---
type: Proof Obligation
title: "Golden eval obligation — Run the Total Rewards Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-total-rewards-optimizer-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Total Rewards Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [total-rewards-optimizer-end-to-end](/tests/total-rewards-optimizer-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [query_e_trade_e_trade_records](/tools/query-e-trade-e-trade-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_total_rewards_optimizer_policy_handbook](/tools/lookup-total-rewards-optimizer-policy-handbook.md)

## Entities that must be referenced

- employees
- mercer_records
- e_trade_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [total-rewards-optimizer-policy-handbook](/documents/total-rewards-optimizer-policy-handbook.md)
