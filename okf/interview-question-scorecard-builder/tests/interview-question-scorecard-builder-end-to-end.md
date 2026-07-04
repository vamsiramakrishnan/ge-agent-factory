---
type: Eval Scenario
title: "Run the Interview Question & Scorecard Builder workflow for the current perio..."
description: "Run the Interview Question & Scorecard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "interview-question-scorecard-builder-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Interview Question & Scorecard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [kit-distribution](/queries/kit-distribution.md)

## Mechanisms to call

- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_google_calendar_events](/tools/query-google-calendar-events.md)
- [lookup_interview_question_scorecard_builder_policy_handbook](/tools/lookup-interview-question-scorecard-builder-policy-handbook.md)
- [action_ats_generate](/tools/action-ats-generate.md)

## Success rubric

Action generate executed against ATS, with audit-trail entry and Hiring Manager notified of outcomes.

# Citations

- [Interview Question & Scorecard Builder Policy Handbook](/documents/interview-question-scorecard-builder-policy-handbook.md)
