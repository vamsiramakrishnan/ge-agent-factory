---
type: Query Capability
title: "Validate changes against compensation bands, leveling framework, and role tax..."
description: "Validate changes against compensation bands, leveling framework, and role taxonomy. Identify misalignments between JDs, comp data, and HRIS records."
source_id: "cross-validation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Validate changes against compensation bands, leveling framework, and role taxonomy. Identify misalignments between JDs, comp data, and HRIS records.

## Tools used

- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)

## Runs in

- [cross_validation](/workflow/cross-validation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Job Architecture Sync Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/job-architecture-sync-agent-end-to-end.md)

# Citations

- [Job Architecture Sync Agent Policy Handbook](/documents/job-architecture-sync-agent-policy-handbook.md)
