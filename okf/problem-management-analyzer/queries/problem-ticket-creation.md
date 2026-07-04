---
type: Query Capability
title: "Create problem tickets in ServiceNow with root cause analysis, impacted servi..."
description: "Create problem tickets in ServiceNow with root cause analysis, impacted services, and recommended fixes. Track root cause elimination through to permanent resolution."
source_id: "problem-ticket-creation"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Create problem tickets in ServiceNow with root cause analysis, impacted services, and recommended fixes. Track root cause elimination through to permanent resolution.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_problem_management_analyzer_runbook](/tools/lookup-problem-management-analyzer-runbook.md)
- [action_servicenow_generate](/tools/action-servicenow-generate.md)

## Runs in

- [problem_ticket_creation](/workflow/problem-ticket-creation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Problem Management Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/problem-management-analyzer-end-to-end.md)

# Citations

- [Problem Management Analyzer Operations Runbook](/documents/problem-management-analyzer-runbook.md)
