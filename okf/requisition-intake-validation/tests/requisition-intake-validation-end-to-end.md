---
type: Eval Scenario
title: "Run the Requisition Intake & Validation workflow for the current period. Cite..."
description: "Run the Requisition Intake & Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "requisition-intake-validation-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Requisition Intake & Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [intake-validation](/queries/intake-validation.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_requisition_intake_validation_policy_handbook](/tools/lookup-requisition-intake-validation-policy-handbook.md)

## Success rubric

Recruiter receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Requisition Intake & Validation Policy Handbook](/documents/requisition-intake-validation-policy-handbook.md)
