---
type: Query Capability
title: Pull candidate pipeline data from Greenhouse with demographic information at ...
description: Pull candidate pipeline data from Greenhouse with demographic information at each funnel stage. Join with Workday requisition data for hiring manager and role context.
source_id: "pipeline-data-collection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull candidate pipeline data from Greenhouse with demographic information at each funnel stage. Join with Workday requisition data for hiring manager and role context.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_inclusive_hiring_audit_policy_handbook](/tools/lookup-inclusive-hiring-audit-policy-handbook.md)

## Runs in

- [pipeline_data_collection](/workflow/pipeline-data-collection.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Inclusive Hiring Audit workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/inclusive-hiring-audit-end-to-end.md)

# Citations

- [Inclusive Hiring Audit Policy Handbook](/documents/inclusive-hiring-audit-policy-handbook.md)
