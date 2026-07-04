---
type: Query Capability
title: Generate merge suggestions for duplicates with confidence scoring. Propose co...
description: Generate merge suggestions for duplicates with confidence scoring. Propose corrections for missing or invalid fields based on related records and business rules.
source_id: "auto-correction"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate merge suggestions for duplicates with confidence scoring. Propose corrections for missing or invalid fields based on related records and business rules.

## Tools used

- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)

## Runs in

- [auto_correction](/workflow/auto-correction.md)

## Evidence expected

- source_system_record

## Evals

- [Run the HRIS Data Quality Monitor Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hris-data-quality-monitor-agent-end-to-end.md)

# Citations

- [HRIS Data Quality Monitor Agent Policy Handbook](/documents/hris-data-quality-monitor-agent-policy-handbook.md)
