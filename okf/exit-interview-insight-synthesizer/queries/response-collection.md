---
type: Query Capability
title: Aggregate exit interview transcripts and survey data from Qualtrics. Enrich w...
description: "Aggregate exit interview transcripts and survey data from Qualtrics. Enrich with Workday demographics — tenure, level, department, manager — for segmented analysis."
source_id: "response-collection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Aggregate exit interview transcripts and survey data from Qualtrics. Enrich with Workday demographics — tenure, level, department, manager — for segmented analysis.

## Tools used

- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_exit_interview_insight_synthesizer_policy_handbook](/tools/lookup-exit-interview-insight-synthesizer-policy-handbook.md)
- [action_survey_platform_recommend](/tools/action-survey-platform-recommend.md)

## Runs in

- [response_collection](/workflow/response-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Exit Interview Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/exit-interview-insight-synthesizer-end-to-end.md)

# Citations

- [Exit Interview Insight Synthesizer Policy Handbook](/documents/exit-interview-insight-synthesizer-policy-handbook.md)
