---
type: Eval Scenario
title: "Run the Resume Screening & Shortlisting workflow for the current period. Cite..."
description: "Run the Resume Screening & Shortlisting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "resume-screening-shortlisting-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Resume Screening & Shortlisting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [application-ingestion](/queries/application-ingestion.md)

## Mechanisms to call

- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_cloud_ai_billing_records](/tools/query-google-cloud-ai-billing-records.md)
- [lookup_resume_screening_shortlisting_policy_handbook](/tools/lookup-resume-screening-shortlisting-policy-handbook.md)
- [action_ats_file](/tools/action-ats-file.md)

## Success rubric

Action file executed against ATS, with audit-trail entry and Recruiter notified of outcomes.

# Citations

- [Resume Screening & Shortlisting Policy Handbook](/documents/resume-screening-shortlisting-policy-handbook.md)
