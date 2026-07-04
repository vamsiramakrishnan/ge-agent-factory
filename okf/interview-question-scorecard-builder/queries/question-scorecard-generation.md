---
type: Query Capability
title: Gemini generates structured interview questions mapped to required competenci...
description: "Gemini generates structured interview questions mapped to required competencies. Builds rubric-based scorecards with behavioral anchors and rating scales."
source_id: "question-scorecard-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates structured interview questions mapped to required competencies. Builds rubric-based scorecards with behavioral anchors and rating scales.

## Tools used

- [lookup_interview_question_scorecard_builder_policy_handbook](/tools/lookup-interview-question-scorecard-builder-policy-handbook.md)
- [action_ats_generate](/tools/action-ats-generate.md)

## Runs in

- [question_scorecard_generation](/workflow/question-scorecard-generation.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Interview Question & Scorecard Builder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/interview-question-scorecard-builder-end-to-end.md)

# Citations

- [Interview Question & Scorecard Builder Policy Handbook](/documents/interview-question-scorecard-builder-policy-handbook.md)
