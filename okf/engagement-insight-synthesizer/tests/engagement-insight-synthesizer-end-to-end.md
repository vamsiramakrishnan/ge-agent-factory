---
type: Eval Scenario
title: Run the Engagement Insight Synthesizer workflow for the current period. Cite ...
description: "Run the Engagement Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "engagement-insight-synthesizer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Engagement Insight Synthesizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [statistical-driver-analysis](/queries/statistical-driver-analysis.md)

## Mechanisms to call

- [query_culture_amp_engagement_surveys](/tools/query-culture-amp-engagement-surveys.md)
- [query_qualtrics_survey_responses](/tools/query-qualtrics-survey-responses.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_engagement_insight_synthesizer_policy_handbook](/tools/lookup-engagement-insight-synthesizer-policy-handbook.md)
- [action_culture_amp_execute](/tools/action-culture-amp-execute.md)

## Success rubric

Action execute executed against Culture Amp, with audit-trail entry and HRBP notified of outcomes.

# Citations

- [Engagement Insight Synthesizer Policy Handbook](/documents/engagement-insight-synthesizer-policy-handbook.md)
