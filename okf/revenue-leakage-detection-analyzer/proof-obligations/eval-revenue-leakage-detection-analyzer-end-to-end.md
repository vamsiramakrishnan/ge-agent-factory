---
type: Proof Obligation
title: "Golden eval obligation — Run the Revenue Leakage Detection Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-revenue-leakage-detection-analyzer-end-to-end"
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

# Golden eval obligation — Run the Revenue Leakage Detection Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [revenue-leakage-detection-analyzer-end-to-end](/tests/revenue-leakage-detection-analyzer-end-to-end.md)


## Mechanisms

- [query_amdocs_ces_billing_billing_accounts](/tools/query-amdocs-ces-billing-billing-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_revenue_leakage_detection_analyzer_assurance_runbook](/tools/lookup-revenue-leakage-detection-analyzer-assurance-runbook.md)
- [action_amdocs_ces_billing_create](/tools/action-amdocs-ces-billing-create.md)

## Entities that must be referenced

- billing_accounts
- analytics_events
- dashboards

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute create without two-system evidence

# Citations

- [revenue-leakage-detection-analyzer-assurance-runbook](/documents/revenue-leakage-detection-analyzer-assurance-runbook.md)
