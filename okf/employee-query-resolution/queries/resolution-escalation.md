---
type: Query Capability
title: "Deliver answer to employee. For complex queries, create ServiceNow ticket wit..."
description: "Deliver answer to employee. For complex queries, create ServiceNow ticket with full interaction context and route to appropriate specialist."
source_id: "resolution-escalation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Deliver answer to employee. For complex queries, create ServiceNow ticket with full interaction context and route to appropriate specialist.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_employee_query_resolution_policy_handbook](/tools/lookup-employee-query-resolution-policy-handbook.md)

## Runs in

- [resolution_escalation](/workflow/resolution-escalation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Employee Query Resolution workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/employee-query-resolution-end-to-end.md)

# Citations

- [Employee Query Resolution Policy Handbook](/documents/employee-query-resolution-policy-handbook.md)
