---
type: Eval Scenario
title: "Run the Leave Utilization & Compliance Analyzer workflow for the current peri..."
description: "Run the Leave Utilization & Compliance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "leave-utilization-compliance-analyzer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Leave Utilization & Compliance Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [leave-data-aggregation](/queries/leave-data-aggregation.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_benefits_platform_benefit_plans](/tools/query-benefits-platform-benefit-plans.md)
- [lookup_leave_utilization_compliance_analyzer_policy_handbook](/tools/lookup-leave-utilization-compliance-analyzer-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Success rubric

Action execute executed against Workday, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [Leave Utilization & Compliance Analyzer Policy Handbook](/documents/leave-utilization-compliance-analyzer-policy-handbook.md)
