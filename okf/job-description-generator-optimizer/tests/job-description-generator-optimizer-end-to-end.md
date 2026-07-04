---
type: Eval Scenario
title: "Run the Job Description Generator & Optimizer workflow for the current period..."
description: "Run the Job Description Generator & Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "job-description-generator-optimizer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Job Description Generator & Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [competency-ingestion](/queries/competency-ingestion.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_textio_textio_records](/tools/query-textio-textio-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_job_description_generator_optimizer_policy_handbook](/tools/lookup-job-description-generator-optimizer-policy-handbook.md)
- [action_workday_file](/tools/action-workday-file.md)

## Success rubric

Action file executed against Workday, with audit-trail entry and Recruiter notified of outcomes.

# Citations

- [Job Description Generator & Optimizer Policy Handbook](/documents/job-description-generator-optimizer-policy-handbook.md)
