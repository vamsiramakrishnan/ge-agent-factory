---
type: Proof Obligation
title: "Golden eval obligation — Run the Job Description Generator & Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-job-description-generator-optimizer-end-to-end"
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

# Golden eval obligation — Run the Job Description Generator & Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [job-description-generator-optimizer-end-to-end](/tests/job-description-generator-optimizer-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_textio_textio_records](/tools/query-textio-textio-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_job_description_generator_optimizer_policy_handbook](/tools/lookup-job-description-generator-optimizer-policy-handbook.md)
- [action_workday_file](/tools/action-workday-file.md)

## Entities that must be referenced

- employees
- linkedin_records
- textio_records
- documents

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute file without two-system evidence

# Citations

- [job-description-generator-optimizer-policy-handbook](/documents/job-description-generator-optimizer-policy-handbook.md)
