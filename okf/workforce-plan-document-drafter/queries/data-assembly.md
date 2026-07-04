---
type: Query Capability
title: "Pull workforce model outputs, org data, and scenario results from Workday and..."
description: "Pull workforce model outputs, org data, and scenario results from Workday and BigQuery. Structure data into document-ready format with charts and tables."
source_id: "data-assembly"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull workforce model outputs, org data, and scenario results from Workday and BigQuery. Structure data into document-ready format with charts and tables.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_workforce_plan_document_drafter_policy_handbook](/tools/lookup-workforce-plan-document-drafter-policy-handbook.md)

## Runs in

- [data_assembly](/workflow/data-assembly.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Workforce Plan Document Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/workforce-plan-document-drafter-end-to-end.md)

# Citations

- [Workforce Plan Document Drafter Policy Handbook](/documents/workforce-plan-document-drafter-policy-handbook.md)
