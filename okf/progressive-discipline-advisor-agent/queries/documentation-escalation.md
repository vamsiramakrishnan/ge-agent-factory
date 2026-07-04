---
type: Query Capability
title: "Document approved action in ServiceNow with full audit trail. Route high-risk..."
description: "Document approved action in ServiceNow with full audit trail. Route high-risk cases to ER team with pre-assembled context for expedited review."
source_id: "documentation-escalation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Document approved action in ServiceNow with full audit trail. Route high-risk cases to ER team with pre-assembled context for expedited review.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_progressive_discipline_advisor_agent_policy_handbook](/tools/lookup-progressive-discipline-advisor-agent-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [documentation_escalation](/workflow/documentation-escalation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Progressive Discipline Advisor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/progressive-discipline-advisor-agent-end-to-end.md)

# Citations

- [Progressive Discipline Advisor Agent Policy Handbook](/documents/progressive-discipline-advisor-agent-policy-handbook.md)
