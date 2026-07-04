---
type: Query Capability
title: Ingest resumes and application data from Greenhouse. Extract structured data ...
description: "Ingest resumes and application data from Greenhouse. Extract structured data from unstructured documents including PDFs, portfolios, and linked profiles."
source_id: "application-ingestion"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest resumes and application data from Greenhouse. Extract structured data from unstructured documents including PDFs, portfolios, and linked profiles.

## Tools used

- [lookup_resume_screening_shortlisting_policy_handbook](/tools/lookup-resume-screening-shortlisting-policy-handbook.md)
- [action_ats_file](/tools/action-ats-file.md)

## Runs in

- [application_ingestion](/workflow/application-ingestion.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Resume Screening & Shortlisting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/resume-screening-shortlisting-end-to-end.md)

# Citations

- [Resume Screening & Shortlisting Policy Handbook](/documents/resume-screening-shortlisting-policy-handbook.md)
