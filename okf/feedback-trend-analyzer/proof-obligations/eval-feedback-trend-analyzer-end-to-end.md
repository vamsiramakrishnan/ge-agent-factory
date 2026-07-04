---
type: Proof Obligation
title: "Golden eval obligation — Run the Feedback Trend Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-feedback-trend-analyzer-end-to-end"
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

# Golden eval obligation — Run the Feedback Trend Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [feedback-trend-analyzer-end-to-end](/tests/feedback-trend-analyzer-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [lookup_feedback_trend_analyzer_policy_handbook](/tools/lookup-feedback-trend-analyzer-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

## Entities that must be referenced

- employees
- engagement_surveys
- analytics_events
- survey_platform_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute generate without two-system evidence

# Citations

- [feedback-trend-analyzer-policy-handbook](/documents/feedback-trend-analyzer-policy-handbook.md)
