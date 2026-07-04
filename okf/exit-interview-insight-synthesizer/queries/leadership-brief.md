---
type: Query Capability
title: Generate actionable insight summaries for leadership with targeted retention ...
description: Generate actionable insight summaries for leadership with targeted retention recommendations. Prioritize interventions by estimated impact on future attrition.
source_id: "leadership-brief"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate actionable insight summaries for leadership with targeted retention recommendations. Prioritize interventions by estimated impact on future attrition.

## Tools used

- [lookup_exit_interview_insight_synthesizer_policy_handbook](/tools/lookup-exit-interview-insight-synthesizer-policy-handbook.md)
- [action_survey_platform_recommend](/tools/action-survey-platform-recommend.md)

## Runs in

- [leadership_brief](/workflow/leadership-brief.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Exit Interview Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/exit-interview-insight-synthesizer-end-to-end.md)

# Citations

- [Exit Interview Insight Synthesizer Policy Handbook](/documents/exit-interview-insight-synthesizer-policy-handbook.md)
