---
type: Eval Scenario
title: "Run the Learning Content Summarizer & Quiz Generator workflow for the current..."
description: "Run the Learning Content Summarizer & Quiz Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "learning-content-summarizer-quiz-generator-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Learning Content Summarizer & Quiz Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-format-repurposing](/queries/multi-format-repurposing.md)

## Mechanisms to call

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_google_docs_documents](/tools/query-google-docs-documents.md)
- [query_youtube_youtube_records](/tools/query-youtube-youtube-records.md)
- [lookup_learning_content_summarizer_quiz_generator_policy_handbook](/tools/lookup-learning-content-summarizer-quiz-generator-policy-handbook.md)
- [action_lms_generate](/tools/action-lms-generate.md)

## Success rubric

Action generate executed against LMS, with audit-trail entry and Instructional Designer notified of outcomes.

# Citations

- [Learning Content Summarizer & Quiz Generator Policy Handbook](/documents/learning-content-summarizer-quiz-generator-policy-handbook.md)
