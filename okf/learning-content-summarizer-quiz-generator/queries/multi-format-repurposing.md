---
type: Query Capability
title: "Repurpose single-source content into video scripts, flashcards, mobile module..."
description: "Repurpose single-source content into video scripts, flashcards, mobile modules, and email drip campaigns. Publish back to LMS with metadata tagging."
source_id: "multi-format-repurposing"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Repurpose single-source content into video scripts, flashcards, mobile modules, and email drip campaigns. Publish back to LMS with metadata tagging.

## Tools used

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [lookup_learning_content_summarizer_quiz_generator_policy_handbook](/tools/lookup-learning-content-summarizer-quiz-generator-policy-handbook.md)
- [action_lms_generate](/tools/action-lms-generate.md)

## Runs in

- [multi_format_repurposing](/workflow/multi-format-repurposing.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Learning Content Summarizer & Quiz Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/learning-content-summarizer-quiz-generator-end-to-end.md)

# Citations

- [Learning Content Summarizer & Quiz Generator Policy Handbook](/documents/learning-content-summarizer-quiz-generator-policy-handbook.md)
