---
type: Query Capability
title: Capture incident details from ServiceNow and pull employee history from Workd...
description: "Capture incident details from ServiceNow and pull employee history from Workday including prior disciplinary actions, tenure, and performance record."
source_id: "situation-intake"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Capture incident details from ServiceNow and pull employee history from Workday including prior disciplinary actions, tenure, and performance record.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_progressive_discipline_advisor_agent_policy_handbook](/tools/lookup-progressive-discipline-advisor-agent-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [situation_intake](/workflow/situation-intake.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Progressive Discipline Advisor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/progressive-discipline-advisor-agent-end-to-end.md)

# Citations

- [Progressive Discipline Advisor Agent Policy Handbook](/documents/progressive-discipline-advisor-agent-policy-handbook.md)
