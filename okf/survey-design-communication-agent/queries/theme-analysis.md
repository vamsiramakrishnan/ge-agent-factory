---
type: Query Capability
title: "Analyze prior survey data and org-specific engagement themes. Pull participat..."
description: "Analyze prior survey data and org-specific engagement themes. Pull participation history and response patterns from Qualtrics to identify gaps and fatigue signals."
source_id: "theme-analysis"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Analyze prior survey data and org-specific engagement themes. Pull participation history and response patterns from Qualtrics to identify gaps and fatigue signals.

## Tools used

- [query_qualtrics_survey_responses](/tools/query-qualtrics-survey-responses.md)
- [query_culture_amp_engagement_surveys](/tools/query-culture-amp-engagement-surveys.md)
- [lookup_survey_design_communication_agent_policy_handbook](/tools/lookup-survey-design-communication-agent-policy-handbook.md)

## Runs in

- [theme_analysis](/workflow/theme-analysis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Survey Design & Communication Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/survey-design-communication-agent-end-to-end.md)

# Citations

- [Survey Design & Communication Agent Policy Handbook](/documents/survey-design-communication-agent-policy-handbook.md)
