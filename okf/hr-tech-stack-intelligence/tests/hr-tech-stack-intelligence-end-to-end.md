---
type: Eval Scenario
title: Run the HR Tech Stack Intelligence workflow for the current period. Cite the ...
description: "Run the HR Tech Stack Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "hr-tech-stack-intelligence-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the HR Tech Stack Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [utilization-analysis](/queries/utilization-analysis.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_google_admin_google_admin_records](/tools/query-google-admin-google-admin-records.md)
- [query_license_manager_license_manager_records](/tools/query-license-manager-license-manager-records.md)
- [lookup_hr_tech_stack_intelligence_policy_handbook](/tools/lookup-hr-tech-stack-intelligence-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Success rubric

Action recommend executed against Workday, with audit-trail entry and HR Tech Lead notified of outcomes.

# Citations

- [HR Tech Stack Intelligence Policy Handbook](/documents/hr-tech-stack-intelligence-policy-handbook.md)
