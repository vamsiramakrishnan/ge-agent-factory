---
type: Proof Obligation
title: "Golden eval obligation — Run the Interview Question & Scorecard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-interview-question-scorecard-builder-end-to-end"
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

# Golden eval obligation — Run the Interview Question & Scorecard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [interview-question-scorecard-builder-end-to-end](/tests/interview-question-scorecard-builder-end-to-end.md)


## Mechanisms

- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [lookup_interview_question_scorecard_builder_policy_handbook](/tools/lookup-interview-question-scorecard-builder-policy-handbook.md)
- [action_ats_generate](/tools/action-ats-generate.md)

## Entities that must be referenced

- ats_records
- documents
- events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [interview-question-scorecard-builder-policy-handbook](/documents/interview-question-scorecard-builder-policy-handbook.md)
