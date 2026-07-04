---
type: Eval Scenario
title: Run the Progressive Discipline Advisor Agent workflow for the current period....
description: "Run the Progressive Discipline Advisor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "progressive-discipline-advisor-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Progressive Discipline Advisor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [situation-intake](/queries/situation-intake.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [lookup_progressive_discipline_advisor_agent_policy_handbook](/tools/lookup-progressive-discipline-advisor-agent-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Success rubric

Action recommend executed against ServiceNow, with audit-trail entry and HRBP notified of outcomes.

# Citations

- [Progressive Discipline Advisor Agent Policy Handbook](/documents/progressive-discipline-advisor-agent-policy-handbook.md)
