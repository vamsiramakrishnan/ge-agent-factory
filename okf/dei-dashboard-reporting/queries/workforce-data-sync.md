---
type: Query Capability
title: "Sync demographics, hiring, promotion, and attrition data from Workday. Build ..."
description: "Sync demographics, hiring, promotion, and attrition data from Workday. Build intersectional representation models across gender, ethnicity, level, and location dimensions."
source_id: "workforce-data-sync"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Sync demographics, hiring, promotion, and attrition data from Workday. Build intersectional representation models across gender, ethnicity, level, and location dimensions.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Runs in

- [workforce_data_sync](/workflow/workforce-data-sync.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the DEI Dashboard & Reporting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dei-dashboard-reporting-end-to-end.md)

# Citations

- [DEI Dashboard & Reporting Policy Handbook](/documents/dei-dashboard-reporting-policy-handbook.md)
