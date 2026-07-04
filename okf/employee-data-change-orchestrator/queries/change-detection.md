---
type: Query Capability
title: "Detect employee data changes from HRIS lifecycle events — hires, transfers, p..."
description: "Detect employee data changes from HRIS lifecycle events — hires, transfers, promotions, terminations. Validate completeness and route through appropriate approval workflow."
source_id: "change-detection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Detect employee data changes from HRIS lifecycle events — hires, transfers, promotions, terminations. Validate completeness and route through appropriate approval workflow.

## Tools used

- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [lookup_employee_data_change_orchestrator_policy_handbook](/tools/lookup-employee-data-change-orchestrator-policy-handbook.md)

## Runs in

- [change_detection](/workflow/change-detection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Employee Data Change Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/employee-data-change-orchestrator-end-to-end.md)

# Citations

- [Employee Data Change Orchestrator Policy Handbook](/documents/employee-data-change-orchestrator-policy-handbook.md)
