---
type: Proof Obligation
title: "Golden eval obligation — Run the Resume Screening & Shortlisting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-resume-screening-shortlisting-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Resume Screening & Shortlisting workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [resume-screening-shortlisting-end-to-end](/tests/resume-screening-shortlisting-end-to-end.md)


## Mechanisms

- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_cloud_ai_billing_records](/tools/query-google-cloud-ai-billing-records.md)
- [lookup_resume_screening_shortlisting_policy_handbook](/tools/lookup-resume-screening-shortlisting-policy-handbook.md)
- [action_ats_file](/tools/action-ats-file.md)

## Entities that must be referenced

- ats_records
- employees
- billing_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [resume-screening-shortlisting-policy-handbook](/documents/resume-screening-shortlisting-policy-handbook.md)
