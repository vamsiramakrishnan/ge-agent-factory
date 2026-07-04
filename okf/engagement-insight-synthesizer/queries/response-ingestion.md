---
type: Query Capability
title: Pull survey responses with full demographic and org hierarchy context from Qu...
description: "Pull survey responses with full demographic and org hierarchy context from Qualtrics. Join with Workday data for team-level segmentation and tenure-based analysis."
source_id: "response-ingestion"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull survey responses with full demographic and org hierarchy context from Qualtrics. Join with Workday data for team-level segmentation and tenure-based analysis.

## Tools used

- [query_qualtrics_survey_responses](/tools/query-qualtrics-survey-responses.md)
- [query_workday_employees](/tools/query-workday-employees.md)

## Runs in

- [response_ingestion](/workflow/response-ingestion.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Engagement Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/engagement-insight-synthesizer-end-to-end.md)

# Citations

- [Engagement Insight Synthesizer Policy Handbook](/documents/engagement-insight-synthesizer-policy-handbook.md)
