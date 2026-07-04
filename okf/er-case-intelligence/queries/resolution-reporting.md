---
type: Query Capability
title: Draft investigation summary and recommended actions for ER Lead review. Docum...
description: Draft investigation summary and recommended actions for ER Lead review. Document resolution with complete audit trail in ServiceNow.
source_id: "resolution-reporting"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Draft investigation summary and recommended actions for ER Lead review. Document resolution with complete audit trail in ServiceNow.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [resolution_reporting](/workflow/resolution-reporting.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the ER Case Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/er-case-intelligence-end-to-end.md)

# Citations

- [ER Case Intelligence Policy Handbook](/documents/er-case-intelligence-policy-handbook.md)
