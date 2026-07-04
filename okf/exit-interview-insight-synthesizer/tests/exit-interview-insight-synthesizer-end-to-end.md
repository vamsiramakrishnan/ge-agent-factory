---
type: Eval Scenario
title: Run the Exit Interview Insight Synthesizer workflow for the current period. C...
description: "Run the Exit Interview Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "exit-interview-insight-synthesizer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Exit Interview Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [response-collection](/queries/response-collection.md)

## Mechanisms to call

- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_exit_interview_insight_synthesizer_policy_handbook](/tools/lookup-exit-interview-insight-synthesizer-policy-handbook.md)
- [action_survey_platform_recommend](/tools/action-survey-platform-recommend.md)

## Success rubric

Action recommend executed against Survey Platform, with audit-trail entry and HRBP notified of outcomes.

# Citations

- [Exit Interview Insight Synthesizer Policy Handbook](/documents/exit-interview-insight-synthesizer-policy-handbook.md)
