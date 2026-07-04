---
type: Query Capability
title: "Aggregate compensation, demographics, role, tenure, and performance data from..."
description: "Aggregate compensation, demographics, role, tenure, and performance data from Workday. Normalize across pay structures, currencies, and jurisdictions."
source_id: "compensation-data-sync"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate compensation, demographics, role, tenure, and performance data from Workday. Normalize across pay structures, currencies, and jurisdictions.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Runs in

- [compensation_data_sync](/workflow/compensation-data-sync.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Pay Equity Audit workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pay-equity-audit-end-to-end.md)

# Citations

- [Pay Equity Audit Policy Handbook](/documents/pay-equity-audit-policy-handbook.md)
