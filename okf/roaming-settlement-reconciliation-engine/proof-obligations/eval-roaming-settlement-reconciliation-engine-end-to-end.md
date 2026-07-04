---
type: Proof Obligation
title: "Golden eval obligation — Run the Roaming Settlement Reconciliation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-roaming-settlement-reconciliation-engine-end-to-end"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Roaming Settlement Reconciliation Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [roaming-settlement-reconciliation-engine-end-to-end](/tests/roaming-settlement-reconciliation-engine-end-to-end.md)


## Mechanisms

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_roaming_settlement_reconciliation_engine_assurance_runbook](/tools/lookup-roaming-settlement-reconciliation-engine-assurance-runbook.md)
- [action_amdocs_ces_billing_file](/tools/action-amdocs-ces-billing-file.md)

## Entities that must be referenced

- billing_accounts
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [roaming-settlement-reconciliation-engine-assurance-runbook](/documents/roaming-settlement-reconciliation-engine-assurance-runbook.md)
