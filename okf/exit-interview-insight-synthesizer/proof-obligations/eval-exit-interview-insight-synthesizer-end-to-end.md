---
type: Proof Obligation
title: "Golden eval obligation — Run the Exit Interview Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-exit-interview-insight-synthesizer-end-to-end"
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

# Golden eval obligation — Run the Exit Interview Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [exit-interview-insight-synthesizer-end-to-end](/tests/exit-interview-insight-synthesizer-end-to-end.md)


## Mechanisms

- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [lookup_exit_interview_insight_synthesizer_policy_handbook](/tools/lookup-exit-interview-insight-synthesizer-policy-handbook.md)
- [action_survey_platform_recommend](/tools/action-survey-platform-recommend.md)

## Entities that must be referenced

- survey_platform_records
- employees
- documents

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [exit-interview-insight-synthesizer-policy-handbook](/documents/exit-interview-insight-synthesizer-policy-handbook.md)
