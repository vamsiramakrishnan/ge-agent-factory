---
type: Query Capability
title: Gemini extracts key concepts into microlearning modules. Generates competency...
description: "Gemini extracts key concepts into microlearning modules. Generates competency-mapped assessment questions with difficulty calibration aligned to learning objectives."
source_id: "summarization-quiz-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini extracts key concepts into microlearning modules. Generates competency-mapped assessment questions with difficulty calibration aligned to learning objectives.

## Tools used

- [lookup_learning_content_summarizer_quiz_generator_policy_handbook](/tools/lookup-learning-content-summarizer-quiz-generator-policy-handbook.md)
- [action_lms_generate](/tools/action-lms-generate.md)

## Runs in

- [summarization_quiz_generation](/workflow/summarization-quiz-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Learning Content Summarizer & Quiz Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/learning-content-summarizer-quiz-generator-end-to-end.md)

# Citations

- [Learning Content Summarizer & Quiz Generator Policy Handbook](/documents/learning-content-summarizer-quiz-generator-policy-handbook.md)
