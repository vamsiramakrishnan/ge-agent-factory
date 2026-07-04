---
type: Proof Obligation
title: "Golden eval obligation — Run the Deposit Attrition Early Warning Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-deposit-attrition-early-warning-monitor-end-to-end"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Deposit Attrition Early Warning Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [deposit-attrition-early-warning-monitor-end-to-end](/tests/deposit-attrition-early-warning-monitor-end-to-end.md)


## Mechanisms

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_deposit_attrition_early_warning_monitor_compliance_policy](/tools/lookup-deposit-attrition-early-warning-monitor-compliance-policy.md)
- [action_temenos_transact_publish](/tools/action-temenos-transact-publish.md)

## Entities that must be referenced

- core_accounts
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute publish without two-system evidence

# Citations

- [deposit-attrition-early-warning-monitor-compliance-policy](/documents/deposit-attrition-early-warning-monitor-compliance-policy.md)
