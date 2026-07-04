---
type: Workflow Stage
title: Change Detection
description: "Detect employee data changes from HRIS lifecycle events — hires, transfers, promotions, terminations. Validate completeness and route through appropriate approval workflow."
source_id: change_detection
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Change Detection

Detect employee data changes from HRIS lifecycle events — hires, transfers, promotions, terminations. Validate completeness and route through appropriate approval workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [lookup_employee_data_change_orchestrator_policy_handbook](/tools/lookup-employee-data-change-orchestrator-policy-handbook.md)

Next: [Cross-System Validation](/workflow/cross-system-validation.md)
