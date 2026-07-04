---
type: Eval Scenario
title: Run the Restructuring Impact Assessment Agent workflow for the current period...
description: "Run the Restructuring Impact Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "restructuring-impact-assessment-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Restructuring Impact Assessment Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [scenario-role-mapping](/queries/scenario-role-mapping.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_skills_db_skills_db_records](/tools/query-skills-db-skills-db-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_restructuring_impact_assessment_agent_policy_handbook](/tools/lookup-restructuring-impact-assessment-agent-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Success rubric

Action recommend executed against Workday, with audit-trail entry and CHRO notified of outcomes.

# Citations

- [Restructuring Impact Assessment Agent Policy Handbook](/documents/restructuring-impact-assessment-agent-policy-handbook.md)
