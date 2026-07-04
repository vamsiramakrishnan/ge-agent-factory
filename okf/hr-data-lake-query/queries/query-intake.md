---
type: Query Capability
title: "Receive natural language question from user. Parse intent, identify required ..."
description: "Receive natural language question from user. Parse intent, identify required data domains (HRIS, ATS, LMS, compensation), and validate user access permissions."
source_id: "query-intake"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive natural language question from user. Parse intent, identify required data domains (HRIS, ATS, LMS, compensation), and validate user access permissions.

## Tools used

- [lookup_hr_data_lake_query_policy_handbook](/tools/lookup-hr-data-lake-query-policy-handbook.md)

## Runs in

- [query_intake](/workflow/query-intake.md)

## Evidence expected

- document_reference

## Evals

- [Run the HR Data Lake Query workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hr-data-lake-query-end-to-end.md)

# Citations

- [HR Data Lake Query Policy Handbook](/documents/hr-data-lake-query-policy-handbook.md)
