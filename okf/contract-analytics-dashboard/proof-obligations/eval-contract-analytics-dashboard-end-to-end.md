---
type: Proof Obligation
title: "Golden eval obligation — Run the Contract Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-contract-analytics-dashboard-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Contract Analytics Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [contract-analytics-dashboard-end-to-end](/tests/contract-analytics-dashboard-end-to-end.md)


## Mechanisms

- [query_icertis_analytics_contracts](/tools/query-icertis-analytics-contracts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_contract_analytics_dashboard_policy_guide](/tools/lookup-contract-analytics-dashboard-policy-guide.md)
- [action_icertis_analytics_generate](/tools/action-icertis-analytics-generate.md)

## Entities that must be referenced

- contracts
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [contract-analytics-dashboard-policy-guide](/documents/contract-analytics-dashboard-policy-guide.md)
