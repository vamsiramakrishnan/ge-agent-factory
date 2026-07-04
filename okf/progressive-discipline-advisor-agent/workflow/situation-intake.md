---
type: Workflow Stage
title: Situation Intake
description: "Capture incident details from ServiceNow and pull employee history from Workday including prior disciplinary actions, tenure, and performance record."
source_id: situation_intake
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Situation Intake

Capture incident details from ServiceNow and pull employee history from Workday including prior disciplinary actions, tenure, and performance record.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_progressive_discipline_advisor_agent_policy_handbook](/tools/lookup-progressive-discipline-advisor-agent-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

Next: [Precedent Search & Analysis](/workflow/precedent-search-analysis.md)
