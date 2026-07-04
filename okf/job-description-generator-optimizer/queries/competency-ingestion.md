---
type: Query Capability
title: "Pull role competency profiles, job family definitions, and leveling framework..."
description: "Pull role competency profiles, job family definitions, and leveling framework from Workday. Structure requirements for JD generation."
source_id: "competency-ingestion"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull role competency profiles, job family definitions, and leveling framework from Workday. Structure requirements for JD generation.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [action_workday_file](/tools/action-workday-file.md)

## Runs in

- [competency_ingestion](/workflow/competency-ingestion.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Job Description Generator & Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/job-description-generator-optimizer-end-to-end.md)

# Citations

- [Job Description Generator & Optimizer Policy Handbook](/documents/job-description-generator-optimizer-policy-handbook.md)
