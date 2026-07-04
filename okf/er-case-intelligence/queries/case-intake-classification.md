---
type: Query Capability
title: "Ingest new ER case from ServiceNow with details and evidence. Auto-classify b..."
description: "Ingest new ER case from ServiceNow with details and evidence. Auto-classify by type, severity, and applicable policy domain. Pull employee context from Workday."
source_id: "case-intake-classification"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest new ER case from ServiceNow with details and evidence. Auto-classify by type, severity, and applicable policy domain. Pull employee context from Workday.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_er_case_intelligence_policy_handbook](/tools/lookup-er-case-intelligence-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [case_intake_classification](/workflow/case-intake-classification.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the ER Case Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/er-case-intelligence-end-to-end.md)

# Citations

- [ER Case Intelligence Policy Handbook](/documents/er-case-intelligence-policy-handbook.md)
