---
type: Proof Obligation
title: "Golden eval obligation — Run the Leave Utilization & Compliance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-leave-utilization-compliance-analyzer-end-to-end"
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

# Golden eval obligation — Run the Leave Utilization & Compliance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [leave-utilization-compliance-analyzer-end-to-end](/tests/leave-utilization-compliance-analyzer-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [lookup_leave_utilization_compliance_analyzer_policy_handbook](/tools/lookup-leave-utilization-compliance-analyzer-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Entities that must be referenced

- employees
- analytics_events
- benefit_plans

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [leave-utilization-compliance-analyzer-policy-handbook](/documents/leave-utilization-compliance-analyzer-policy-handbook.md)
