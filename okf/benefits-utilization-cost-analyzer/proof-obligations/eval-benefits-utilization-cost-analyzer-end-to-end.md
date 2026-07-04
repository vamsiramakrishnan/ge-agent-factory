---
type: Proof Obligation
title: "Golden eval obligation — Run the Benefits Utilization & Cost Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-benefits-utilization-cost-analyzer-end-to-end"
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

# Golden eval obligation — Run the Benefits Utilization & Cost Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [benefits-utilization-cost-analyzer-end-to-end](/tests/benefits-utilization-cost-analyzer-end-to-end.md)


## Mechanisms

- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [query_carrier_reports_carrier_reports_records](/tools/query-carrier-reports-carrier-reports-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_benefits_utilization_cost_analyzer_policy_handbook](/tools/lookup-benefits-utilization-cost-analyzer-policy-handbook.md)

## Entities that must be referenced

- benefit_plans
- carrier_reports_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [benefits-utilization-cost-analyzer-policy-handbook](/documents/benefits-utilization-cost-analyzer-policy-handbook.md)
