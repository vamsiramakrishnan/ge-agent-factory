---
type: Proof Obligation
title: "Golden eval obligation — Run the Onboarding Effectiveness Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-onboarding-effectiveness-analyzer-end-to-end"
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

# Golden eval obligation — Run the Onboarding Effectiveness Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [onboarding-effectiveness-analyzer-end-to-end](/tests/onboarding-effectiveness-analyzer-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_onboarding_effectiveness_analyzer_policy_handbook](/tools/lookup-onboarding-effectiveness-analyzer-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Entities that must be referenced

- employees
- lms_records
- survey_platform_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [onboarding-effectiveness-analyzer-policy-handbook](/documents/onboarding-effectiveness-analyzer-policy-handbook.md)
